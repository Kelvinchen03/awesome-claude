import { describe, it, expect } from "vitest";
import {
  registrySearchResponseSchema,
  registrySearchResultSchema,
  registryTrendingResponseSchema,
  publicJobItemSchema,
  publicJobsResponseSchema,
} from "../apps/web/src/lib/api/contracts";
import { normalizeRaycastJob } from "../integrations/raycast/src/jobs-feed";
import { normalizeRaycastEntry as normalizeEntry } from "../integrations/raycast/src/feed";

const minimalValidEntry = {
  category: "mcp",
  slug: "test-server",
  title: "Test Server",
  description: "A test MCP server",
  tags: ["test"],
  keywords: [],
  author: "Test Author",
  dateAdded: "2024-01-01",
  installable: false,
  verificationStatus: "unverified",
  documentationUrl: "https://example.com",
  repoUrl: "https://github.com/test/test",
  url: "https://heyclau.de/mcp/test-server",
  canonicalUrl: "https://heyclau.de/mcp/test-server",
  llmsUrl: "https://heyclau.de/api/registry/entries/mcp/test-server/llms",
  apiUrl: "https://heyclau.de/api/registry/entries/mcp/test-server",
  trustSignals: {},
};

const minimalValidJob = {
  slug: "test-job",
  title: "Test Engineer",
  company: "Test Co",
  location: "Remote",
  description: "A test job description here",
  applyUrl: "https://example.com/apply",
  featured: false,
  webUrl: "https://heyclau.de/jobs/test-job",
  labels: ["Remote"],
  sourceLabel: "Editorially curated",
  applySourceLabel: "External apply",
};

describe("Registry search API contract", () => {
  it("parses a valid search response", () => {
    const result = registrySearchResponseSchema.safeParse({
      schemaVersion: 1,
      query: "test",
      category: "",
      platform: "",
      count: 1,
      total: 1,
      limit: 20,
      offset: 0,
      nextOffset: null,
      results: [minimalValidEntry],
    });
    expect(result.success).toBe(true);
  });

  it("rejects a response missing required fields", () => {
    const result = registrySearchResponseSchema.safeParse({
      schemaVersion: 1,
      query: "test",
    });
    expect(result.success).toBe(false);
  });

  it("parses a valid search result with brand assets and trust signals", () => {
    const result = registrySearchResultSchema.safeParse({
      ...minimalValidEntry,
      slug: "branded-server",
      brandName: "Brand Corp",
      brandDomain: "brand.com",
      brandIconUrl: "https://heyclau.de/api/brand-assets/icon/brand.com",
      downloadTrust: "first-party",
      trustSignals: { packageVerified: true, sourceStatus: "available" },
    });
    expect(result.success).toBe(true);
  });

  it("parses a valid trending response", () => {
    const result = registryTrendingResponseSchema.safeParse({
      schemaVersion: 1,
      kind: "registry-trending",
      category: "",
      platform: "",
      limit: 12,
      count: 1,
      signalsAvailable: { votes: true, community: false, intent: true },
      entries: [
        {
          category: "mcp",
          slug: "trending-server",
          title: "Trending Server",
          description: "A trending MCP server",
          canonicalUrl: "https://heyclau.de/mcp/trending-server",
          platforms: ["claude-desktop"],
          tags: ["popular"],
          dateAdded: "2024-01-01",
          score: 42.5,
          reasons: ["high_votes"],
          trustSignals: { sourceStatus: "available" },
        },
      ],
    });
    expect(result.success).toBe(true);
  });
});

describe("Jobs API contract", () => {
  it("parses a valid publicJobItem", () => {
    const result = publicJobItemSchema.safeParse(minimalValidJob);
    expect(result.success).toBe(true);
  });

  it("rejects a publicJobItem missing required webUrl", () => {
    const { webUrl: _dropped, ...noWebUrl } = minimalValidJob;
    const result = publicJobItemSchema.safeParse(noWebUrl);
    expect(result.success).toBe(false);
  });

  it("rejects a publicJobItem missing required sourceLabel", () => {
    const { sourceLabel: _dropped, ...noSourceLabel } = minimalValidJob;
    const result = publicJobItemSchema.safeParse(noSourceLabel);
    expect(result.success).toBe(false);
  });

  it("parses a valid publicJobsResponse envelope", () => {
    const result = publicJobsResponseSchema.safeParse({
      generatedAt: "2026-01-01T00:00:00.000Z",
      count: 1,
      entries: [minimalValidJob],
    });
    expect(result.success).toBe(true);
  });

  it("parses a publicJobsResponse with no entries", () => {
    const result = publicJobsResponseSchema.safeParse({ entries: [] });
    expect(result.success).toBe(true);
  });
});

describe("Raycast jobs parser drift detection", () => {
  it("normalizeRaycastJob accepts a payload valid per publicJobItemSchema", () => {
    const contractValidPayload = publicJobItemSchema.parse(minimalValidJob);
    const parsed = normalizeRaycastJob(contractValidPayload);
    expect(parsed).not.toBeNull();
    expect(parsed?.slug).toBe("test-job");
    expect(parsed?.company).toBe("Test Co");
    expect(parsed?.webUrl).toBe("https://heyclau.de/jobs/test-job");
    expect(parsed?.sourceLabel).toBe("Editorially curated");
  });

  it("normalizeRaycastJob rejects a payload missing required contract fields", () => {
    const {
      webUrl: _w,
      sourceLabel: _s,
      applySourceLabel: _a,
      ...stripped
    } = minimalValidJob;
    expect(normalizeRaycastJob(stripped)).toBeNull();
  });

  it("normalizeRaycastJob accepts all optional fields from publicJobItemSchema", () => {
    const fullPayload = publicJobItemSchema.parse({
      ...minimalValidJob,
      companyUrl: "https://example.com",
      descriptionMd: "## Full description",
      type: "Full-time",
      postedAt: "2026-01-01",
      compensation: "$150K-$190K",
      equity: "Offered",
      benefits: ["Health", "Remote"],
      responsibilities: ["Ship code"],
      requirements: ["TypeScript"],
      featured: true,
      sponsored: false,
      tier: "featured",
      source: "curated",
      sourceKind: "official_ats",
      isRemote: true,
      isWorldwide: false,
      lastVerifiedAt: "2026-01-01",
    });
    const parsed = normalizeRaycastJob(fullPayload);
    expect(parsed).not.toBeNull();
    expect(parsed?.tier).toBe("featured");
    expect(parsed?.source).toBe("curated");
    expect(parsed?.featured).toBe(true);
  });
});

describe("Raycast feed parser drift detection", () => {
  it("normalizeRaycastEntry accepts a feed entry that covers registrySearchResult shared fields", () => {
    const feedEntry = {
      ...minimalValidEntry,
      webUrl: minimalValidEntry.url,
      installCommand: "claude mcp add test-server",
      configSnippet: "",
      copyText: "full asset content here",
      detailMarkdown: "# Test Server",
    };
    const parsed = normalizeEntry(feedEntry);
    expect(parsed).not.toBeNull();
    expect(parsed?.slug).toBe("test-server");
    expect(parsed?.category).toBe("mcp");
    expect(parsed?.verificationStatus).toBe("unverified");
  });

  it("normalizeRaycastEntry rejects entries missing required shared fields", () => {
    expect(normalizeEntry({ title: "Missing required fields" })).toBeNull();
    expect(
      normalizeEntry({ category: "mcp", slug: "no-description" }),
    ).toBeNull();
  });

  it("normalizeRaycastEntry preserves downloadTrust values from contract enum", () => {
    const firstParty = normalizeEntry({
      category: "mcp",
      slug: "trusted",
      title: "Trusted",
      description: "Desc",
      webUrl: "https://heyclau.de/mcp/trusted",
      copyText: "content",
      detailMarkdown: "# Trusted",
      downloadTrust: "first-party",
    });
    expect(firstParty?.downloadTrust).toBe("first-party");

    const external = normalizeEntry({
      category: "mcp",
      slug: "external",
      title: "External",
      description: "Desc",
      webUrl: "https://heyclau.de/mcp/external",
      copyText: "content",
      detailMarkdown: "# External",
      downloadTrust: "external",
    });
    expect(external?.downloadTrust).toBe("external");

    const unknown = normalizeEntry({
      category: "mcp",
      slug: "unknown",
      title: "Unknown",
      description: "Desc",
      webUrl: "https://heyclau.de/mcp/unknown",
      copyText: "content",
      detailMarkdown: "# Unknown",
      downloadTrust: "invalid-value",
    });
    expect(unknown?.downloadTrust).toBeNull();
  });
});
