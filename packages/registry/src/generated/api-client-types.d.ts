/**
 * Generated API client types from contracts.ts
 * DO NOT EDIT MANUALLY - Run `pnpm generate:api-types` to regenerate
 *
 * This file provides shared TypeScript types for API responses consumed by:
 * - Raycast extension (integrations/raycast)
 * - MCP server package (packages/mcp)
 *
 * Source of truth: apps/web/src/lib/api/contracts.ts
 *
 * For runtime validation, clients should import schemas directly from contracts.ts
 * or use their own defensive parsing logic.
 */

import type { z } from "zod";
import type {
  registrySearchResponseSchema,
  registrySearchResultSchema,
  registryTrendingResponseSchema,
  registryBrandAssetSchema,
  registryProvenanceSchema,
  registryTrustSignalsSchema,
  registrySearchFacetsSchema,
  publicJobsQuerySchema,
  publicJobItemSchema,
  publicJobsResponseSchema,
  apiErrorEnvelopeSchema,
} from "../../../apps/web/src/lib/api/contracts.js";

// TypeScript types derived from contract schemas
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
export type PublicJobItem = z.infer<typeof publicJobItemSchema>;
export type PublicJobsResponse = z.infer<typeof publicJobsResponseSchema>;
export type ApiErrorEnvelope = z.infer<typeof apiErrorEnvelopeSchema>;
