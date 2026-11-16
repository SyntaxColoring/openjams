import { z } from "zod";

const Feature = z.object({
  type: z.literal("Feature"),
  geometry: z.object({
    type: z.literal("Point"),
    coordinates: z.tuple([z.number(), z.number()]),
  }),
  properties: z.object({
    neighborhood: z.string(),
  }),
});

const ResponseBody = z.object({
  type: z.literal("FeatureCollection"),
  features: z.array(Feature),
});

export interface GeosearchResult {
  latitude: number;
  longitude: number;
  neighborhood: string;
}

/**
 * Look up an address, like "123 Main Street, Brooklyn NY 12345".
 * It should tolerate various address formats.
 */
export async function geosearch(
  query: string,
): Promise<GeosearchResult | null> {
  const url = new URL("https://geosearch.planninglabs.nyc/v2/search");
  url.searchParams.append("text", query);
  url.searchParams.append("size", "1");
  const fetchResult = await fetch(url, {
    headers: {
      Accept: "application/json",
    },
  });
  if (!fetchResult.ok) {
    throw new Error(`${url} returned HTTP ${fetchResult.status}`);
  }
  const parsedResult = await fetchResult.json();
  const validatedResult = z.parse(ResponseBody, parsedResult);
  if (validatedResult.features.length < 1) {
    throw new Error(`${url} returned 0 results`);
  }
  const match = validatedResult.features[0];
  return {
    longitude: match.geometry.coordinates[0],
    latitude: match.geometry.coordinates[1],
    neighborhood: match.properties.neighborhood,
  };
}
