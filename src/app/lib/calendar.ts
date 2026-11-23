import ical, { ParameterValue } from "node-ical";
import { USER_AGENT } from "../../user-agent";

// TODO: This should probably be a Cloudflare binding or something.
const ICS_URL =
  "https://calendar.google.com/calendar/ical/7f12d39ab2b58242b4d6828425d81cd5066795c0d1e0c40fc0543b52dc88cbf0%40group.calendar.google.com/public/basic.ics";

export interface RecurringEvent {
  /** Globally unique identifier. */
  id: string;
  occurrences: EventOccurrence[];
}

export interface EventOccurrence {
  title: string;
  description: string;
  start: Temporal.Instant;
  end: Temporal.Instant;
  location: string | null;
}

/**
 * Returns upcoming instances of events, in no particular order.
 */
export async function fetchEvents(
  from: Temporal.Instant,
  to: Temporal.Instant,
): Promise<RecurringEvent[]> {
  const icsResponse = await fetch(ICS_URL, {
    headers: {
      "User-Agent": USER_AGENT,
      Accept: "text/calendar",
    },
  });
  if (!icsResponse.ok) {
    throw new Error(`${ICS_URL} returned HTTP ${icsResponse.status}`);
  }

  const parsedICS = ical.sync.parseICS(await icsResponse.text());

  const rawEvents = Object.values(parsedICS).filter(
    (v) => v?.type === "VEVENT",
  );
  const rawEventsExpanded = rawEvents.map((rawEvent) => ({
    rawEvent,
    rawOccurrences: ical.expandRecurringEvent(rawEvent, {
      from: new Date(from.epochMilliseconds),
      to: new Date(to.epochMilliseconds),
      expandOngoing: true,
    }),
  }));
  const mapped = rawEventsExpanded.map(
    ({ rawEvent, rawOccurrences }): RecurringEvent => ({
      id: rawEvent.uid,
      occurrences: rawOccurrences.map((rawOccurrence) => ({
        // node-ical types summary as required,
        // but it seems like Google Calendar can omit it.
        title: rawOccurrence.event.summary
          ? getValue(rawOccurrence.event.summary)
          : "Untitled event",
        description: rawOccurrence.event.description
          ? getValue(rawOccurrence.event.description)
          : "",
        location: rawOccurrence.event.location
          ? getValue(rawOccurrence.event.location)
          : null,
        start: rawOccurrence.start.toTemporalInstant(),
        end: rawOccurrence.end.toTemporalInstant(),
      })),
    }),
  );
  return mapped;
}

function getValue(parametersAndValue: ParameterValue): string {
  return typeof parametersAndValue === "string"
    ? parametersAndValue
    : parametersAndValue.val;
}
