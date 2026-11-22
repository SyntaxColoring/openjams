import { z } from "zod";
import { get as cacheGet, put as cachePut } from "./cache";
import { USER_AGENT } from "../../user-agent";

// The API doesn't define a rate limit, but this seems reasonable.
const REQUESTS_PER_SEC = 10;

const CACHE_VERSION = "1";

export interface GeosearchResult {
  latitude: number;
  longitude: number;
  neighborhood: string;
}

/**
 * Look up an address, like "123 Main Street, Brooklyn NY 12345".
 * It tolerates various address formats.
 *
 * Returns a map from query to result.
 * Queries that returned no usable result will be omitted from the map.
 *
 * https://geosearch.planninglabs.nyc/
 */
export async function geosearch(
  queries: string[],
): Promise<Map<string, GeosearchResult>> {
  const cachedResults = await cacheGet(
    queries.map(cacheKey),
    ResponseBody,
    // This data is unlikely to ever change.
    Temporal.Instant.fromEpochMilliseconds(0),
  );

  const cachedFetch = async (query: string): Promise<ResponseBody> => {
    const cached = cachedResults.get(cacheKey(query));
    if (cached !== undefined) {
      return cached;
    } else {
      const fetched = await fetchGeosearch(query);
      await cachePut<ResponseBody>(
        cacheKey(query),
        fetched,
        Temporal.Now.instant(),
      );
      await sleep(1000 / REQUESTS_PER_SEC);
      return fetched;
    }
  };

  const results = new Map<string, GeosearchResult>();
  for (const query of queries) {
    const response = await cachedFetch(query);
    if (response.features.length > 0) {
      const feature = response.features[0];
      results.set(query, {
        longitude: feature.geometry.coordinates[0],
        latitude: feature.geometry.coordinates[1],
        neighborhood: response.features[0].properties.neighbourhood,
      });
    }
  }
  return results;
}

async function fetchGeosearch(query: string): Promise<ResponseBody> {
  const url = new URL("https://geosearch.planninglabs.nyc/v2/search");
  url.searchParams.append("text", query);
  url.searchParams.append("size", "1");
  const fetchResult = await fetch(url, {
    headers: {
      "User-Agent": USER_AGENT,
      Accept: "application/json",
    },
  });

  if (!fetchResult.ok) {
    throw new Error(`${url} returned HTTP ${fetchResult.status}`);
  }
  const parsedResult = await fetchResult.json();
  const validatedResult = z.parse(ResponseBody, parsedResult);
  return validatedResult;
}

const Feature = z.object({
  type: z.literal("Feature"),
  geometry: z.object({
    type: z.literal("Point"),
    coordinates: z.tuple([z.number(), z.number()]),
  }),
  properties: z.object({
    neighbourhood: z.string(),
  }),
});

const ResponseBody = z.object({
  type: z.literal("FeatureCollection"),
  features: z.array(Feature),
});
type ResponseBody = z.infer<typeof ResponseBody>;

function cacheKey(query: string): string {
  return `geosearch-${CACHE_VERSION}-${query}`;
}

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
