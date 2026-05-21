import type { Metadata } from "next";

import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Screenshot QA Process",
  description: "Guidelines for running visual regression and screenshot comparison tests across HeyClaude.",
  path: "/design-system/qa",
  robots: { index: false, follow: false },
});

function CodeBlock({ children }: { children: React.ReactNode }) {
  return (
    <pre className="mt-2 overflow-x-auto rounded-2xl border border-border bg-card p-4 text-sm leading-7 text-foreground">
      <code className="block whitespace-pre-wrap">{children}</code>
    </pre>
  );
}

function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xl font-semibold tracking-tight text-foreground">
      {children}
    </h2>
  );
}

function H3({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-lg font-semibold tracking-tight text-foreground">
      {children}
    </h3>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="text-base leading-8 text-muted-foreground">{children}</p>;
}

function Ul({ children }: { children: React.ReactNode }) {
  return (
    <ul className="my-4 list-disc space-y-2 pl-5 text-base leading-7 text-muted-foreground">
      {children}
    </ul>
  );
}

function Li({ children }: { children: React.ReactNode }) {
  return <li>{children}</li>;
}

export default function ScreenshotQaPage() {
  return (
    <div className="container-shell space-y-10 py-12">
      <div className="space-y-4 border-b border-border/80 pb-8">
        <span className="eyebrow">Internal</span>
        <h1 className="section-title">Screenshot QA Process</h1>
        <P>
          This page documents how we run visual regression checks across
          HeyClaude using Playwright screenshot comparisons.
        </P>
      </div>

      <section className="space-y-4">
        <H2>Overview</H2>
        <P>
          Screenshot QA prevents unintended visual regressions by capturing
          baseline images of key views and comparing them against subsequent
          builds. Any pixel difference above the configured threshold fails the
          build and blocks deployment until reviewed.
        </P>
      </section>

      <section className="space-y-4">
        <H2>Target Views</H2>
        <P>Each release must pass screenshot comparison on the following routes:</P>
        <Ul>
          <Li>
            <strong className="text-foreground">Home</strong> —{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-sm">/</code>{" "}
            Hero, stats grid, directory preview, and footer.
          </Li>
          <Li>
            <strong className="text-foreground">Browse</strong> —{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-sm">/browse</code>{" "}
            Directory listing, search bar, filters, and cards.
          </Li>
          <Li>
            <strong className="text-foreground">Detail</strong> —{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-sm">/:category/:slug</code>{" "}
            Entry detail page with markdown prose, related cards, and vote rail.
          </Li>
          <Li>
            <strong className="text-foreground">Submit</strong> —{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-sm">/submit</code>{" "}
            Submission form, preview card, and readiness check.
          </Li>
          <Li>
            <strong className="text-foreground">Quality</strong> —{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-sm">/quality</code>{" "}
            Quality signals, provenance, and SEO checklist.
          </Li>
          <Li>
            <strong className="text-foreground">Submissions</strong> —{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-sm">/submissions</code>{" "}
            Submission queue and editorial status.
          </Li>
        </Ul>
      </section>

      <section className="space-y-4">
        <H2>Viewport Sizes</H2>
        <P>Two viewport configurations are required:</P>
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
          <P>Run after intentional design changes to accept new references:</P>
          <CodeBlock>{`npx playwright test --update-snapshots`}</CodeBlock>
        </div>

        <div className="space-y-2">
          <H3>Run comparison only</H3>
          <P>Fail on any difference from the stored baseline:</P>
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
            Default pixel diff ratio: <code className="rounded bg-muted px-1.5 py-0.5 text-sm">0.2</code>
          </Li>
          <Li>
            Animations are disabled during capture via{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-sm">caret-color: transparent</code>{" "}
            and reduced-motion emulation.
          </Li>
          <Li>
            Dynamic content (e.g., live GitHub stars) is stubbed or hidden
            with <code className="rounded bg-muted px-1.5 py-0.5 text-sm">data-testid="screenshot-stable"</code>{" "}
            wrappers where possible.
          </Li>
        </Ul>
      </section>

      <section className="space-y-4">
        <H2>Baseline Storage</H2>
        <P>
          Baseline screenshots are committed to the repository under{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 text-sm">tests/__screenshots__/</code>.
          Each platform and viewport gets its own subdirectory so CI can run
          Linux baselines while local development uses macOS or Windows
          equivalents.
        </P>
      </section>

      <section className="space-y-4">
        <H2>CI Integration</H2>
        <P>
          The screenshot QA job runs after the build step and before deployment.
          If snapshots are missing for the current platform, the job generates
          them and uploads them as artifacts rather than failing. On subsequent
          runs, the generated artifacts are compared.
        </P>
      </section>
    </div>
  );
}
