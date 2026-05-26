# Generated API Client Types

This directory contains auto-generated TypeScript types derived from the API contracts in `apps/web/src/lib/api/contracts.ts`.

## Purpose

These types provide a shared contract between:
- **Raycast extension** (`integrations/raycast`) - for parsing registry feed responses
- **MCP server package** (`packages/mcp`) - for tool output type safety

## Usage

### TypeScript Types Only

```typescript
import type {
  RegistrySearchResponse,
  RegistrySearchResult,
  RegistryTrendingResponse,
} from "@heyclaude/registry/generated/api-client-types";

// Use for type annotations
function processSearchResults(response: RegistrySearchResponse) {
  response.results.forEach((entry: RegistrySearchResult) => {
    console.log(entry.title);
  });
}
```

### Runtime Validation

For runtime validation, import schemas directly from contracts:

```typescript
import { registrySearchResponseSchema } from "../apps/web/src/lib/api/contracts";

const response = await fetch("/api/registry/search");
const data = await response.json();

// Validate untrusted API response
const validated = registrySearchResponseSchema.parse(data);
```

## Regeneration

Types are generated from contracts using:

```bash
pnpm generate:api-types
```

Validation (CI):

```bash
pnpm validate:api-types
```

## Contract Tests

See `tests/api-client-contracts.test.ts` for examples of how these types are validated against the actual API schemas.

## DO NOT EDIT

Files in this directory are auto-generated. Changes will be overwritten. To modify types, update the source schemas in `apps/web/src/lib/api/contracts.ts` and regenerate.
