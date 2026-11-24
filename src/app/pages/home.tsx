import { getEventData } from "../lib/events";

import { RichTextDescription } from "../components/rich-text-description";
import { HomeView } from "../components/home-view";

export async function Home() {
  const eventData = await getEventData(Temporal.Now.instant());
  return (
    <HomeView
      events={eventData.map((event) => {
        const firstOccurrence = event.occurrences[0];
        return {
          id: event.id,
          title: firstOccurrence.title,
          description: (
            <RichTextDescription unsafeHTML={firstOccurrence.description} />
          ),
          start: firstOccurrence.start.epochMilliseconds,
          end: firstOccurrence.end.epochMilliseconds,
          address: firstOccurrence.location,
          latitude: firstOccurrence.geosearchResult?.latitude ?? null,
          longitude: firstOccurrence.geosearchResult?.longitude ?? null,
          neighborhood: firstOccurrence.geosearchResult?.neighborhood ?? null,
        };
      })}
    />
  );
}
