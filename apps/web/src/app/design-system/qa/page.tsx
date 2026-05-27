import type { Metadata } from "next";

import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Screenshot QA Process",
  description:
    "Advisory guidelines for future visual regression and screenshot comparison tests across HeyClaude.",
  path: "/design-system/qa",
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

function CodeBlock({ children }: { children: React.ReactNode }) {
  return (
    <pre className="mt-2 max-w-full overflow-x-auto rounded-xl border border-border bg-card p-3 text-xs leading-6 text-foreground sm:rounded-2xl sm:p-4 sm:text-sm sm:leading-7">
      <code className="block whitespace-pre-wrap break-words">{children}</code>
    </pre>
  );
}

function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-lg font-semibold tracking-tight text-foreground sm:text-xl">
      {children}
    </h2>
  );
}

function H3({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-base font-semibold tracking-tight text-foreground sm:text-lg">
      {children}
    </h3>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-sm leading-7 text-muted-foreground sm:text-base sm:leading-8">
      {children}
    </p>
  );
}

function Ul({ children }: { children: React.ReactNode }) {
  return (
    <ul className="my-4 list-disc space-y-2 pl-5 text-sm leading-7 text-muted-foreground sm:text-base">
      {children}
    </ul>
  );
}

function Li({ children }: { children: React.ReactNode }) {
  return <li>{children}</li>;
}

function InlineCode({ children }: { children: React.ReactNode }) {
  return (
    <code className="break-words rounded bg-muted px-1.5 py-0.5 text-[0.85em]">
      {children}
    </code>
  );
}

export default function ScreenshotQaPage() {
  writeLog("info", "design-system-qa-page-render", {
    path: "/design-system/qa",
  });

  return (
    <div className="container-shell max-w-4xl space-y-8 py-8 sm:space-y-10 sm:py-12">
      <div className="space-y-4 border-b border-border/80 pb-6 sm:pb-8">
        <span className="eyebrow">Internal</span>
        <h1 className="section-title text-balance">Screenshot QA Process</h1>
        <P>
          This page documents the intended visual regression workflow for
          HeyClaude. The current screenshot paths are advisory until maintainers
          establish deterministic baselines.
        </P>
      </div>

      <section className="space-y-4">
        <H2>Overview</H2>
        <P>
          Screenshot QA will prevent unintended visual regressions by capturing
          baseline images of key views and comparing them against subsequent
          builds. Until baselines are committed and CI gates are enabled, use
          this page as process guidance rather than an enforced release check.
        </P>
      </section>

      <section className="space-y-4">
        <H2>Target Views</H2>
        <P>
          The following routes are the recommended baseline candidates once the
          screenshot suite is activated:
        </P>
        <Ul>
          <Li>
            <strong className="text-foreground">Home</strong> —{" "}
            <InlineCode>/</InlineCode> Hero, stats grid, directory preview, and
            footer.
          </Li>
          <Li>
            <strong className="text-foreground">Browse</strong> —{" "}
            <InlineCode>/browse</InlineCode> Directory listing, search bar,
            filters, and cards.
          </Li>
          <Li>
            <strong className="text-foreground">Detail</strong> —{" "}
            <InlineCode>/:category/:slug</InlineCode> Entry detail page with
            markdown prose, related cards, and vote rail.
          </Li>
          <Li>
            <strong className="text-foreground">Submit</strong> —{" "}
            <InlineCode>/submit</InlineCode> Submission form, preview card, and
            readiness check.
          </Li>
          <Li>
            <strong className="text-foreground">Quality</strong> —{" "}
            <InlineCode>/quality</InlineCode> Quality signals, provenance, and
            SEO checklist.
          </Li>
          <Li>
            <strong className="text-foreground">Submissions</strong> —{" "}
            <InlineCode>/submissions</InlineCode> Submission queue and editorial
            status.
          </Li>
        </Ul>
      </section>

      <section className="space-y-4">
        <H2>Viewport Sizes</H2>
        <P>Use these viewport configurations for comparable captures:</P>
        <Ul>
          <Li>
            <strong className="text-foreground">Desktop</strong> — 1920×1080
            (Chromium, full window)
          </Li>
          <Li>
            <strong className="text-foreground">Mobile</strong> — 375×667
            (iPhone SE / small viewport)
          </Li>
        </Ul>
      </section>

      <section className="space-y-4">
        <H2>Running Tests</H2>

        <div className="space-y-2">
          <H3>Update baselines</H3>
          <P>
            Run after intentional design changes once baselines exist and are
            part of the repository:
          </P>
          <CodeBlock>{`npx playwright test --update-snapshots`}</CodeBlock>
        </div>

        <div className="space-y-2">
          <H3>Run comparison only</H3>
          <P>
            Compare against stored baselines after the placeholder spec is
            replaced with real screenshot assertions:
          </P>
          <CodeBlock>{`npx playwright test tests/e2e/screenshot-qa.spec.ts`}</CodeBlock>
        </div>

        <div className="space-y-2">
          <H3>Run with UI mode</H3>
          <P>Useful for debugging failures side-by-side:</P>
          <CodeBlock>{`npx playwright test --ui`}</CodeBlock>
        </div>

        <div className="space-y-2">
          <H3>Run against a deployed preview</H3>
          <P>Point tests to a staging or preview URL:</P>
          <CodeBlock>{`PLAYWRIGHT_BASE_URL=https://preview.heyclau.de npx playwright test tests/e2e/screenshot-qa.spec.ts`}</CodeBlock>
        </div>
      </section>

      <section className="space-y-4">
        <H2>Test Structure Example</H2>
        <P>A minimal Playwright spec using screenshot comparison:</P>
        <CodeBlock>{`import { test, expect } from "@playwright/test";

test("home page matches visual reference", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveScreenshot("home-desktop.png", {
    fullPage: true,
  });
});

test("browse page matches visual reference", async ({ page }) => {
  await page.goto("/browse");
  await expect(page).toHaveScreenshot("browse-desktop.png", {
    fullPage: true,
  });
});`}</CodeBlock>
      </section>

      <section className="space-y-4">
        <H2>Thresholds &amp; Tolerance</H2>
        <Ul>
          <Li>
            Default pixel diff ratio: <InlineCode>0.2</InlineCode>
          </Li>
          <Li>
            Animations are disabled during capture via{" "}
            <InlineCode>caret-color: transparent</InlineCode> and reduced-motion
            emulation.
          </Li>
          <Li>
            Dynamic content (e.g., live GitHub stars) is stubbed or hidden with{" "}
            <InlineCode>data-testid="screenshot-stable"</InlineCode> wrappers
            where possible.
          </Li>
        </Ul>
      </section>

      <section className="space-y-4">
        <H2>Baseline Storage</H2>
        <P>
          Baseline screenshots should be committed only after maintainers choose
          deterministic capture settings. Until then, paths such as{" "}
          <InlineCode>tests/__screenshots__/</InlineCode> are documentation
          examples rather than required repository contents.
        </P>
      </section>

      <section className="space-y-4">
        <H2>CI Integration</H2>
        <P>
          CI should run screenshot QA after the build step and before deployment
          once baselines are established. Until that maintainer gate exists,
          generated screenshots can be uploaded as review artifacts without
          blocking deployment.
        </P>
      </section>
    </div>
  );
}
