import fs from "node:fs";
import path from "node:path";
import { expect, test } from "@playwright/test";

type DirectoryEnvelope = {
  entries: Array<{
    category: string;
    slug: string;
    title: string;
  }>;
};

function getRegressionEntry() {
  const payload = JSON.parse(
    fs.readFileSync(
      path.join(process.cwd(), "apps/web/public/data/directory-index.json"),
      "utf8",
    ),
  ) as DirectoryEnvelope;
  const entry = payload.entries.find(
    (candidate) => candidate.category !== "tools",
  );
  if (!entry)
    throw new Error("No registry entry available for screenshot QA");
  return entry;
}

const entry = getRegressionEntry();

const screenshotRoutes = [
  { path: "/", name: "home" },
  { path: "/browse", name: "browse" },
  { path: `/${entry.category}/${entry.slug}`, name: "detail" },
  { path: "/submit", name: "submit" },
  { path: "/quality", name: "quality" },
  { path: "/submissions", name: "submissions" },
  { path: "/design-system/reference", name: "design-system-reference" },
];

test.describe("screenshot qa", () => {
  for (const route of screenshotRoutes) {
    test(`${route.name} matches visual reference`, async ({ page }) => {
      await page.goto(route.path);
      await expect(page).toHaveScreenshot(`${route.name}.png`, {
        fullPage: true,
      });
    });
  }
});
