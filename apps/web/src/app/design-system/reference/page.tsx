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

function writeLog(
  level: "info" | "error",
  event: string,
  meta: Record<string, unknown> = {},
) {
  const payload = {
    ts: new Date().toISOString(),
    level,
    event,
    ...meta,
  };
  const line = JSON.stringify(payload);
  if (level === "error") {
    console.error(line);
    return;
  }
  console.info(line);
}

export default function DesignSystemReferencePage() {
  writeLog("info", "design-system-reference-page-render", {
    path: "/design-system/reference",
  });
  return <DesignSystemReferenceClient />;
}
