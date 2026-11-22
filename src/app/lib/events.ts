import { fetchEvents } from "./calendar";
import { geosearch } from "./geosearch";

// The window of events to show, relative to now.
const PAST = Temporal.Duration.from({ hours: 6 });
const FUTURE = Temporal.Duration.from({ hours: 24 * 30 });

/**
 * Return upcoming events.
 * Each event is guaranteed to have at least one occurrence.
 * The events are returned in chronological order (based on their next occurrence).
 */
export async function getEventData(now: Temporal.Instant) {
  const from = now.subtract(PAST);
  const to = now.add(FUTURE);

  const events = (await fetchEvents(from, to)).filter(
    (event) => event.occurrences.length > 0,
  );
  for (const event of events) {
    event.occurrences.sort((a, b) =>
      Temporal.Instant.compare(a.start, b.start),
    );
  }
  events.sort((a, b) =>
    Temporal.Instant.compare(a.occurrences[0].start, b.occurrences[0].start),
  );

  const uniqueLocationStrings = new Set(
    events
      .flatMap((event) =>
        event.occurrences.map((occurrence) => occurrence.location),
      )
      .filter((location) => location != null),
  );
  const geosearchResults = await geosearch([...uniqueLocationStrings]);

  const eventsWithGeosearchResults = events.map((event) => ({
    ...event,
    occurrences: event.occurrences.map((occurrence) => ({
      ...occurrence,
      geosearchResult:
        occurrence.location != null
          ? geosearchResults.get(occurrence.location)
          : null,
    })),
  }));
  return eventsWithGeosearchResults;
}
