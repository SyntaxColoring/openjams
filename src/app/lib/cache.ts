/** Generic wrappers to use Cloudflare Workers KV as a cache. */

import z from "zod";

import { env } from "cloudflare:workers";

/**
 * Fetch the given keys from the cache.
 *
 * Nonexistent entries, stale entries, and entries that don't conform
 * to the given schema will be omitted from the returned map.
 */
export async function get<T extends z.ZodType>(
  keys: string[],
  schema: T,
  oldestAllowed: Temporal.Instant,
): Promise<Map<string, z.infer<T>>> {
  const fetchedKVs = await env.KV.get(keys);
  const result = new Map<string, z.infer<T>>();
  for (const [k, v] of fetchedKVs) {
    if (v !== null) {
      try {
        const { storedAt, data } = withTimestamp.parse(JSON.parse(v));
        if (storedAt >= oldestAllowed.epochMilliseconds) {
          const parsedData = schema.parse(data);
          result.set(k, parsedData);
        }
      } catch {
        console.warn(`Unable to parse value for cache key ${k}`);
      }
    }
  }
  return result;
}

/**
 * Insert a value into the cache.
 */
export async function put<T>(
  key: string,
  value: T,
  now: Temporal.Instant,
): Promise<void> {
  return await env.KV.put(
    key,
    JSON.stringify({
      data: value,
      storedAt: now.epochMilliseconds,
    }),
  );
}

const withTimestamp = z.object({
  storedAt: z.number(),
  data: z.unknown(),
});
