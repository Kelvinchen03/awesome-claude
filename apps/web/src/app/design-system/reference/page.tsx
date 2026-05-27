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

type PageLogger = {
  info: (event: string, meta?: Record<string, unknown>) => void;
  error: (event: string, meta?: Record<string, unknown>) => void;
};

function writePageLog(
  level: "info" | "error",
  event: string,
  requestId: string,
  meta: Record<string, unknown> = {},
) {
  const payload = {
    ts: new Date().toISOString(),
    level,
    event,
    requestId,
    ...meta,
  };
  const line = JSON.stringify(payload);
  if (level === "error") {
    console.error(line);
    return;
  }
  console.info(line);
}

function createLogger(requestId: string): PageLogger {
  return {
    info(event, meta = {}) {
      writePageLog("info", event, requestId, meta);
    },
    error(event, meta = {}) {
      writePageLog("error", event, requestId, meta);
    },
  };
}

async function withDuration<T>(
  callback: (context: {
    getDurationMs: () => number;
    logger: PageLogger;
    requestId: string;
  }) => Promise<T>,
) {
  const startedAt = Date.now();
  const requestId = crypto.randomUUID();
  const logger = createLogger(requestId);
  const getDurationMs = () => Date.now() - startedAt;

  try {
    return await callback({ getDurationMs, logger, requestId });
  } catch (error) {
    logger.error("design-system.reference.page.failed", {
      durationMs: getDurationMs(),
      error: error instanceof Error ? error.message : "Unknown error",
    });
    throw error;
  }
}

export default async function DesignSystemReferencePage() {
  return withDuration(async ({ getDurationMs, logger }) => {
    logger.info("design-system.reference.page.summary", {
      durationMs: getDurationMs(),
    });

    return <DesignSystemReferenceClient />;
  });
}
