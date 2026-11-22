import ical, { ParameterValue } from "node-ical";

// TODO: This should probably be a Cloudflare binding or something.
const ICS_URL =
  "https://calendar.google.com/calendar/ical/7f12d39ab2b58242b4d6828425d81cd5066795c0d1e0c40fc0543b52dc88cbf0%40group.calendar.google.com/public/basic.ics";

const PAST = Temporal.Duration.from({ hours: 6 });
const FUTURE = Temporal.Duration.from({ hours: 24 * 30 });

/** A recurring event. */
export interface Event {
  instances: EventInstance[];
}

/** A single occurrence of an event. */
export interface EventInstance {
  title: string;
  description: string;
  start: Temporal.Instant;
  end: Temporal.Instant;
  location: string | null;
}

/**
 * Returns upcoming instances of events.
 *
 * Instances of a given event will be in chronological order,
 * but the events themselves will not be in any particular order.
 */
export async function fetchEvents(now: Temporal.Instant) {
  const icsResponse = await fetch(ICS_URL, {
    headers: {
      Accept: "text/calendar",
    },
  });
  if (!icsResponse.ok) {
    throw new Error(`${ICS_URL} returned HTTP ${icsResponse.status}`);
  }

  const parsedICS = ical.sync.parseICS(await icsResponse.text());

  const from = new Date(now.subtract(PAST).epochMilliseconds);
  const to = new Date(now.add(FUTURE).epochMilliseconds);
  const rawEvents = Object.values(parsedICS).filter(
    (v) => v?.type === "VEVENT",
  );
  const expandedEvents = rawEvents
    .map((event) =>
      ical.expandRecurringEvent(event, {
        from,
        to,
        expandOngoing: true,
      }),
    )
    .map(
      (instances) =>
        ({
          instances: instances.map((instance) => ({
            title: getValue(instance.event.summary),
            description: instance.event.description
              ? getValue(instance.event.description)
              : "",
            location: instance.event.location
              ? getValue(instance.event.location)
              : null,
            start: instance.start.toTemporalInstant(),
            end: instance.end.toTemporalInstant(),
          })),
        }) satisfies Event,
    );
  return expandedEvents;
}

function getValue(parametersAndValue: ParameterValue): string {
  return typeof parametersAndValue === "string"
    ? parametersAndValue
    : parametersAndValue.val;
}
