import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { format as formatWithPrettier } from "prettier";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "..");
const outputPath = path.join(
  repoRoot,
  "packages/registry/src/generated/api-client-types.d.ts",
);

function generateTypeExports() {
  return `/**
 * Generated API client types from contracts.ts
 * DO NOT EDIT MANUALLY - Run \`pnpm generate:api-types\` to regenerate
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
export type RegistrySearchResponse = z.infer<typeof registrySearchResponseSchema>;
export type RegistrySearchResult = z.infer<typeof registrySearchResultSchema>;
export type RegistryTrendingResponse = z.infer<typeof registryTrendingResponseSchema>;
export type RegistryBrandAsset = z.infer<typeof registryBrandAssetSchema>;
export type RegistryProvenance = z.infer<typeof registryProvenanceSchema>;
export type RegistryTrustSignals = z.infer<typeof registryTrustSignalsSchema>;
export type RegistrySearchFacets = z.infer<typeof registrySearchFacetsSchema>;
export type PublicJobsQuery = z.infer<typeof publicJobsQuerySchema>;
export type PublicJobItem = z.infer<typeof publicJobItemSchema>;
export type PublicJobsResponse = z.infer<typeof publicJobsResponseSchema>;
export type ApiErrorEnvelope = z.infer<typeof apiErrorEnvelopeSchema>;
`;
}

async function main() {
  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const rawGenerated = generateTypeExports();
  const generated = await formatWithPrettier(rawGenerated, {
    parser: "typescript",
  });

  if (process.argv.includes("--check")) {
    const current = fs.existsSync(outputPath)
      ? fs.readFileSync(outputPath, "utf8")
      : "";
    if (current !== generated) {
      console.error(
        "API client types are stale. Run `pnpm generate:api-types` and commit the result.",
      );
      process.exit(1);
    }
    console.log("API client types are up to date.");
    process.exit(0);
  }

  fs.writeFileSync(outputPath, generated);
  console.log(`Wrote ${path.relative(repoRoot, outputPath)}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
