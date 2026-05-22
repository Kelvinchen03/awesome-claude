import type { Metadata } from "next";

import { DesignSystemReferenceClient } from "./design-system-reference-client";

import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Design System Reference",
  description:
    "Internal design reference for HeyClaude UI tokens, primitives, and component states.",
  path: "/design-system/reference",
  robots: { index: false, follow: false },
});

export default function DesignSystemReferencePage() {
  return <DesignSystemReferenceClient />;
}
