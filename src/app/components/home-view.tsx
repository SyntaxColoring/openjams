"use client";

import { Fragment, ReactNode, useRef, useState } from "react";

import { PinMap, type PinMapHandle } from "../components/map";

// TODO: This should be taken from the calendar, or configurable.
const LOCALE = "en-US";
const TIMEZONE = "America/New_York";

interface Props {
  events: Event[];
}

interface Event {
  id: string;

  title: string;
  description: ReactNode;

  start: number;
  end: number;

  address: string | null;
  neighborhood: string | null;
  latitude: number | null;
  longitude: number | null;
}

export function HomeView(props: Props) {
  const { events } = props;

  const mapRef = useRef<PinMapHandle>(null);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [hoveredEvent, setHoveredEvent] = useState<string | null>(null);

  // TODO: Somehow show "weekly", "monthly," etc.
  return (
    <div className="home-flex">
      <PinMap
        ref={mapRef}
        className="map"
        pins={events
          .map((event) => {
            return event.latitude != null && event.longitude != null
              ? {
                  id: event.id,
                  latitude: event.latitude,
                  longitude: event.longitude,
                  infoWindowContents: event.title,
                }
              : null;
          })
          .filter((pin) => pin != null)}
        selectedPinID={selectedEvent ?? hoveredEvent}
        onPinClick={setSelectedEvent}
      />
      <Sidebar
        events={events}
        selectedEventID={selectedEvent}
        onSelectEvent={(id) => {
          if (id != null) {
            mapRef.current?.panTo(id);
          }
          setSelectedEvent(id);
        }}
        onHoverEvent={setHoveredEvent}
      />
    </div>
  );
}

function Sidebar(props: {
  events: Event[];
  selectedEventID: string | null;
  onSelectEvent: (newEventID: string | null) => void;
  onHoverEvent: (newEventID: string | null) => void;
}): ReactNode {
  const { events, selectedEventID, onSelectEvent, onHoverEvent } = props;
  const selectedEvent = events.find((event) => event.id === selectedEventID);
  return (
    <div className="home-sidebar">
      {selectedEvent == null ? (
        <>
          <h2>Upcoming open jams</h2>
          {events.map((event) => {
            return (
              <Fragment key={event.id}>
                <h3>
                  <a
                    href=""
                    onClick={(e) => {
                      e.preventDefault();
                      onSelectEvent(event.id);
                    }}
                    onPointerEnter={() => onHoverEvent(event.id)}
                    onPointerLeave={() => onHoverEvent(null)}
                  >
                    {event.title}
                  </a>
                </h3>
                <p>
                  {timeString(event.start, event.end) +
                    (event.neighborhood != null
                      ? ", " + event.neighborhood
                      : "")}
                </p>
              </Fragment>
            );
          })}
        </>
      ) : (
        <>
          <a
            href=""
            onClick={(e) => {
              e.preventDefault();
              onSelectEvent(null);
            }}
          >
            &lt; all jams
          </a>
          <h2>{selectedEvent?.title}</h2>
          <p>{timeString(selectedEvent.start, selectedEvent.end)}</p>
          {selectedEvent.description}
          {selectedEvent.neighborhood && <p>{selectedEvent.neighborhood}</p>}
          {selectedEvent.address && (
            <>
              <p>{displayAddress(selectedEvent.address)}</p>
              <a href={googleMapsURL(selectedEvent.address)}>directions</a>
            </>
          )}
        </>
      )}
    </div>
  );
}

function timeString(start: number, end: number): string {
  const format = Intl.DateTimeFormat(LOCALE, {
    timeZone: TIMEZONE,
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  });
  return format.formatRange(start, end);
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
