import type { z } from "zod";

/**
 * MCP tool input schemas for argument validation.
 *
 * Tool output shapes are aligned with the public API contracts defined in
 * apps/web/src/lib/api/contracts.ts. Shared TypeScript types are available
 * from packages/registry/src/generated/api-client-types.d.ts:
 *
 *   - search_registry        → RegistrySearchResponse
 *   - get_trending_entries   → RegistryTrendingResponse
 *   - get_entry_detail       → RegistrySearchResult (single entry)
 *   - list_category_entries  → RegistrySearchResponse (filtered)
 *   - get_recent_updates     → RegistrySearchResponse (recent slice)
 *
 * When the API contracts change, regenerate shared types with:
 *   pnpm generate:api-types
 */

export const SearchRegistryInputSchema: z.ZodType;
export const ServerInfoInputSchema: z.ZodType;
export const ListCategoryEntriesInputSchema: z.ZodType;
export const RecentUpdatesInputSchema: z.ZodType;
export const RelatedEntriesInputSchema: z.ZodType;
export const EntryDetailInputSchema: z.ZodType;
export const CopyableAssetInputSchema: z.ZodType;
export const CompareEntriesInputSchema: z.ZodType;
export const RegistryStatsInputSchema: z.ZodType;
export const ClientSetupInputSchema: z.ZodType;
export const CompatibilityInputSchema: z.ZodType;
export const InstallGuidanceInputSchema: z.ZodType;
export const PlatformAdapterInputSchema: z.ZodType;
export const ListDistributionFeedsInputSchema: z.ZodType;
export const SubmissionFieldsSchema: z.ZodType;
export const GetSubmissionSchemaInputSchema: z.ZodType;
export const ValidateSubmissionDraftInputSchema: z.ZodType;
export const SearchDuplicateEntriesInputSchema: z.ZodType;
export const BuildSubmissionUrlsInputSchema: z.ZodType;
export const CategorySubmissionGuidanceInputSchema: z.ZodType;
export const PrepareSubmissionDraftInputSchema: z.ZodType;
export const GetSubmissionExamplesInputSchema: z.ZodType;
export const ReviewSubmissionDraftInputSchema: z.ZodType;
export const SubmissionPolicyInputSchema: z.ZodType;
export const ExplainEntryTrustInputSchema: z.ZodType;
export const ReviewEntrySafetyInputSchema: z.ZodType;
export const TOOL_INPUT_SCHEMAS: Record<string, z.ZodType>;

export function jsonSchemaForTool(name: string): Record<string, unknown>;
export function jsonSchemaForToolOutput(name: string): Record<string, unknown>;
export function parseToolArguments(
  name: string,
  args?: Record<string, unknown>,
): Record<string, unknown>;
export function formatZodError(
  error: unknown,
): Array<{ path: string; message: string; code: string }> | null;
