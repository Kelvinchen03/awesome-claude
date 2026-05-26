/**
 * Generated API client types from contracts.ts
 * DO NOT EDIT MANUALLY - Run `pnpm generate:api-types` to regenerate
 */

import { z } from "zod";

// Re-export schemas from contracts for client consumption
export {
  registrySearchResponseSchema,
  registrySearchResultSchema,
  registryTrendingResponseSchema,
  registryBrandAssetSchema,
  registryProvenanceSchema,
  registryTrustSignalsSchema,
  registrySearchFacetsSchema,
  publicJobsQuerySchema,
  apiErrorEnvelopeSchema,
} from "../../apps/web/src/lib/api/contracts.js";

// TypeScript types derived from schemas
export type RegistrySearchResponse = z.infer<
  typeof registrySearchResponseSchema
>;
export type RegistrySearchResult = z.infer<typeof registrySearchResultSchema>;
export type RegistryTrendingResponse = z.infer<
  typeof registryTrendingResponseSchema
>;
export type RegistryBrandAsset = z.infer<typeof registryBrandAssetSchema>;
export type RegistryProvenance = z.infer<typeof registryProvenanceSchema>;
export type RegistryTrustSignals = z.infer<typeof registryTrustSignalsSchema>;
export type RegistrySearchFacets = z.infer<typeof registrySearchFacetsSchema>;
export type PublicJobsQuery = z.infer<typeof publicJobsQuerySchema>;
export type ApiErrorEnvelope = z.infer<typeof apiErrorEnvelopeSchema>;

// Helper validators for runtime parsing
export function parseRegistrySearchResponse(
  data: unknown,
): RegistrySearchResponse {
  return registrySearchResponseSchema.parse(data);
}

export function parseRegistrySearchResult(data: unknown): RegistrySearchResult {
  return registrySearchResultSchema.parse(data);
}

export function parseRegistryTrendingResponse(
  data: unknown,
): RegistryTrendingResponse {
  return registryTrendingResponseSchema.parse(data);
}

export function safeParseRegistrySearchResponse(
  data: unknown,
):
  | { success: true; data: RegistrySearchResponse }
  | { success: false; error: z.ZodError } {
  const result = registrySearchResponseSchema.safeParse(data);
  return result.success
    ? { success: true, data: result.data }
    : { success: false, error: result.error };
}

export function safeParseRegistrySearchResult(
  data: unknown,
):
  | { success: true; data: RegistrySearchResult }
  | { success: false; error: z.ZodError } {
  const result = registrySearchResultSchema.safeParse(data);
  return result.success
    ? { success: true, data: result.data }
    : { success: false, error: result.error };
}

export function safeParseRegistryTrendingResponse(
  data: unknown,
):
  | { success: true; data: RegistryTrendingResponse }
  | { success: false; error: z.ZodError } {
  const result = registryTrendingResponseSchema.safeParse(data);
  return result.success
    ? { success: true, data: result.data }
    : { success: false, error: result.error };
}
