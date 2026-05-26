# API Client Types Migration Guide

This document explains how to use the shared API client types to prevent drift between backend contracts and client parsers.

## Overview

**Problem:** Raycast and MCP had duplicate parsing logic that could drift from the actual API contracts.

**Solution:** Generate shared TypeScript types from the canonical API contracts in `apps/web/src/lib/api/contracts.ts`.

## Generated Types Location

```
packages/registry/src/generated/api-client-types.d.ts
```

## For Raycast Extension

### Current State

Raycast has manual type definitions and parsers in:
- `integrations/raycast/src/feed.ts` - `RaycastEntry` type and `normalizeRaycastEntry` parser
- `integrations/raycast/src/jobs-feed.ts` - `RaycastJob` type and `normalizeRaycastJob` parser

### Available Shared Types

- `RegistrySearchResponse` - Full search API response
- `RegistrySearchResult` - Individual registry entry
- `RegistryTrendingResponse` - Trending entries response
- `PublicJobItem` - Individual job listing
- `PublicJobsResponse` - Jobs API response envelope
- `ApiErrorEnvelope` - Error response shape

### Migration Path

#### Option 1: Use Shared Types (Recommended for new code)

```typescript
import type { RegistrySearchResult } from "@heyclaude/registry/generated/api-client-types";
import { registrySearchResultSchema } from "../../apps/web/src/lib/api/contracts";

// Type-safe with shared contract
export type RaycastEntry = RegistrySearchResult & {
  // Add Raycast-specific computed fields
  installCommand: string;
  configSnippet: string;
  copyText: string;
};

export function normalizeRaycastEntry(value: unknown): RaycastEntry | null {
  // Validate against canonical schema
  const result = registrySearchResultSchema.safeParse(value);
  if (!result.success) return null;

  // Add Raycast-specific transformations
  return {
    ...result.data,
    installCommand: generateInstallCommand(result.data),
    configSnippet: generateConfigSnippet(result.data),
    copyText: generateCopyText(result.data),
  };
}
```

#### Option 2: Keep Existing Types, Add Validation

```typescript
import { registrySearchResultSchema } from "../../apps/web/src/lib/api/contracts";

export function normalizeRaycastEntry(value: unknown): RaycastEntry | null {
  // First validate against canonical schema
  const contractResult = registrySearchResultSchema.safeParse(value);
  if (!contractResult.success) {
    console.warn("Entry failed contract validation:", contractResult.error);
    return null;
  }

  // Then apply existing Raycast normalization
  // ... existing code ...
}
```

## For MCP Server Package

### Current State

MCP has separate zod schemas in `packages/mcp/src/schemas.js` for tool inputs/outputs.

### Migration Path

#### Use Shared Types for Tool Outputs

```typescript
import type {
  RegistrySearchResponse,
  RegistryTrendingResponse,
} from "@heyclaude/registry/generated/api-client-types";

// MCP tool output should match API response shape
export async function searchRegistry(
  args?: Record<string, unknown>,
  options?: RegistryArtifactLoaders,
): Promise<RegistrySearchResponse> {
  // Tool implementation returns API-compatible response
  const results = await loadSearchResults(args, options);
  return {
    schemaVersion: 1,
    query: args?.query || "",
    category: args?.category || "",
    platform: args?.platform || "",
    count: results.length,
    total: results.length,
    limit: args?.limit || 20,
    offset: 0,
    nextOffset: null,
    results,
  };
}
```

#### Keep MCP Self-Contained

Since the MCP package must be publishable independently:

1. **Build-time copy** (if needed): Copy shared types into MCP package during build
2. **Type-only imports**: Use `import type` to avoid runtime dependencies
3. **Validation**: MCP can import contracts for validation during development/testing

## Contract Tests

The `tests/api-client-contracts.test.ts` file ensures:

1. Generated types match runtime schemas
2. Mock API responses parse correctly
3. Type compatibility is maintained
4. **Drift-detection:** Raycast parsers accept contract-valid payloads
5. **Drift-detection:** Raycast parsers preserve contract enum values
6. **Drift-detection:** Raycast parsers reject payloads missing required fields

Run tests:

```bash
pnpm test tests/api-client-contracts.test.ts
```

## Validation Workflow

### During Development

```bash
# Regenerate types after changing contracts
pnpm generate:api-types

# Verify types are up-to-date
pnpm validate:api-types

# Run contract tests
pnpm test tests/api-client-contracts.test.ts
```

### In CI

```bash
# Fails if generated types are stale
pnpm validate:api-types

# Fails if contracts changed without updating clients
pnpm test:mcp
npm test  # Raycast extension tests
```

## Benefits

1. **Single source of truth**: API contracts in `contracts.ts`
2. **Type safety**: Clients get TypeScript errors when contracts change
3. **Runtime validation**: Clients can validate untrusted responses
4. **Drift prevention**: CI fails if clients don't match contracts
5. **Documentation**: Types serve as API documentation

## Future Enhancements

1. Generate JSON Schema for additional validation
2. Generate OpenAPI client SDKs
3. Add response mocking utilities for tests
4. Version API contracts and track breaking changes
