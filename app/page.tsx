import type { Metadata } from "next";
import { EventInstance, fetchEvents } from "./lib/calendar";

// TODO: This should be taken from the calendar, or configurable.
const LOCALE = "en-US";
const TIMEZONE = "America/New_York";

export const metadata: Metadata = {
  title: "NYC Open Jams",
};

export default async function Home() {
  // TODO: Does this require Temporal support on the client?
  console.log("Fetching");
  const events = await fetchEvents(Temporal.Now.instant());
  console.log("Done fetching. Got events: ", events);
  const eventInstances = events
    .flatMap((event) => event.instances.at(0) ?? [])
    .toSorted((a, b) => Temporal.Instant.compare(a.start, b.start));
  // TODO: Somehow show "weekly", "monthly," etc.
  return (
    <>
      <h1>NYC Open Jams</h1>
      {eventInstances.map((eventInstance) => (
        <>
          <h2>{eventInstance.title}</h2>
          <p>{timeString(eventInstance)}</p>
          {eventInstance.location && (
            <p>
              <a href={googleMapsURL(eventInstance.location)}>
                {displayAddress(eventInstance.location)}
              </a>
            </p>
          )}
          {/*TODO: Render formatting in description.
            Google Calendar turns line breaks into <br> (which we should turn into <p>),
            turns links into <a href="..."> even when the text is identical to the URL,
            turns italics into <i>, etc.*/}
          <p>{eventInstance.description}</p>
        </>
      ))}
    </>
  );
}

// function groupEventsForDisplay(events: Event[]):

function timeString(eventInstance: EventInstance): string {
  const format = Intl.DateTimeFormat(LOCALE, {
    timeZone: TIMEZONE,
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  });
  return format.formatRange(eventInstance.start, eventInstance.end);
}

function googleMapsURL(address: string): string {
  // Per https://developers.google.com/maps/documentation/urls/get-started.
  const url = new URL("https://www.google.com/maps/search/");
  url.searchParams.set("api", "1");
  url.searchParams.set("query", address);
  return url.toString();
}

function displayAddress(address: string): string {
  // Google Calendar returns addresses ending in "USA". Strip that.
  return address.replace(/,\s*USA$/, "");
}
