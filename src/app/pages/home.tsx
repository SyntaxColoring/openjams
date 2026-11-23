import { Fragment } from "react";

import { EventOccurrence } from "../lib/calendar";
import { getEventData } from "../lib/events";

import { PinMap } from "../components/map";
import { RichTextDescription } from "../components/rich-text-description";

// TODO: This should be taken from the calendar, or configurable.
const LOCALE = "en-US";
const TIMEZONE = "America/New_York";

export async function Home() {
  const events = await getEventData(Temporal.Now.instant());

  // TODO: Somehow show "weekly", "monthly," etc.
  return (
    <div className="home-flex">
      <PinMap
        className="map"
        pins={events
          .map((event) => {
            const nextOccurrence = event.occurrences[0];
            return nextOccurrence.geosearchResult
              ? {
                  id: event.id,
                  latitude: nextOccurrence.geosearchResult.latitude,
                  longitude: nextOccurrence.geosearchResult.longitude,
                  infoWindowContents: nextOccurrence.title,
                  // TODO: Add global "selected" stage
                  // TODO: Fix spacing to the right of the info window title
                  // TODO: Programmatic panning
                }
              : null;
          })
          .filter((pin) => pin != null)}
      />
      <div className="home-sidebar">
        <h2>Upcoming open jams</h2>
        {events.map((event) => {
          const nextOccurrence = event.occurrences[0];
          return (
            <Fragment key={event.id}>
              <h3>{nextOccurrence.title}</h3>
              <p>{timeString(nextOccurrence)}</p>
              {nextOccurrence.geosearchResult && (
                <p>{nextOccurrence.geosearchResult.neighborhood}</p>
              )}
              {nextOccurrence.location && (
                <p>
                  <a href={googleMapsURL(nextOccurrence.location)}>
                    {displayAddress(nextOccurrence.location)}
                  </a>
                </p>
              )}
              <RichTextDescription unsafeHTML={nextOccurrence.description} />
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}

function timeString(eventInstance: EventOccurrence): string {
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
