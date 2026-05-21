import { describe, expect, it } from "vitest";
import path from "node:path";
import fs from "node:fs";

const repoRoot = path.resolve(import.meta.dirname, "..");
const fixturesRoot = path.join(repoRoot, "tests/fixtures/hooks");

describe("hook content validation", () => {
  describe("security regression fixtures for hook script bodies", () => {
    // Vulnerable fixtures tests
    it("has vulnerable fixture for predictable /tmp/ debug logs", () => {
      const fixturePath = path.join(fixturesRoot, "vulnerable-tmp-debug-log.mdx");
      expect(fs.existsSync(fixturePath)).toBe(true);
      
      const content = fs.readFileSync(fixturePath, "utf8");
      expect(content).toContain('scriptBody:');
      expect(content).toContain('/tmp/');
      expect(content).not.toContain('mktemp');
    });

    it("has vulnerable fixture for community download references", () => {
      const fixturePath = path.join(fixturesRoot, "vulnerable-community-download.mdx");
      expect(fs.existsSync(fixturePath)).toBe(true);
      
      const content = fs.readFileSync(fixturePath, "utf8");
      expect(content).toContain('downloadUrl:');
      expect(content).toContain('.zip');
      expect(content).toContain('curl');
    });

    it("has vulnerable fixture for missing safety notes", () => {
      const fixturePath = path.join(fixturesRoot, "vulnerable-missing-safety-notes.mdx");
      expect(fs.existsSync(fixturePath)).toBe(true);
      
      const content = fs.readFileSync(fixturePath, "utf8");
      expect(content).toContain('scriptBody:');
      expect(content).toContain('delete');
      expect(content).not.toContain('safetyNotes:');
    });

    it("has vulnerable fixture for missing privacy notes", () => {
      const fixturePath = path.join(fixturesRoot, "vulnerable-missing-privacy-notes.mdx");
      expect(fs.existsSync(fixturePath)).toBe(true);
      
      const content = fs.readFileSync(fixturePath, "utf8");
      expect(content).toContain('scriptBody:');
      expect(content).toContain('find');
      expect(content).toContain('curl');
      expect(content).not.toContain('privacyNotes:');
    });

    // Safe fixtures tests
    it("has safe fixture with proper quoting", () => {
      const fixturePath = path.join(fixturesRoot, "safe-proper-quoting.mdx");
      expect(fs.existsSync(fixturePath)).toBe(true);
      
      const content = fs.readFileSync(fixturePath, "utf8");
      expect(content).toContain('scriptBody:');
      expect(content).toContain('"$');
    });

    it("has safe fixture with secure tmp usage", () => {
      const fixturePath = path.join(fixturesRoot, "safe-secure-tmp-usage.mdx");
      expect(fs.existsSync(fixturePath)).toBe(true);
      
      const content = fs.readFileSync(fixturePath, "utf8");
      expect(content).toContain('scriptBody:');
      expect(content).toContain('mktemp');
      expect(content).toContain('trap');
    });

    it("has safe fixture without external downloads", () => {
      const fixturePath = path.join(fixturesRoot, "safe-no-external-downloads.mdx");
      expect(fs.existsSync(fixturePath)).toBe(true);
      
      const content = fs.readFileSync(fixturePath, "utf8");
      expect(content).toContain('scriptBody:');
      expect(content).toContain('repoUrl:');
      expect(content).not.toContain('downloadUrl:');
    });

    it("has safe fixture with safety notes for destructive actions", () => {
      const fixturePath = path.join(fixturesRoot, "safe-with-safety-notes.mdx");
      expect(fs.existsSync(fixturePath)).toBe(true);
      
      const content = fs.readFileSync(fixturePath, "utf8");
      expect(content).toContain('scriptBody:');
      expect(content).toContain('safetyNotes:');
      expect(content).toContain('delete');
      expect(content).toContain('Deletes temporary files');
    });

    it("has safe fixture with privacy notes for local data access", () => {
      const fixturePath = path.join(fixturesRoot, "safe-with-privacy-notes.mdx");
      expect(fs.existsSync(fixturePath)).toBe(true);
      
      const content = fs.readFileSync(fixturePath, "utf8");
      expect(content).toContain('scriptBody:');
      expect(content).toContain('privacyNotes:');
      expect(content).toContain('find');
      expect(content).toContain('Reads local workspace');
    });

    // Summary test
    it("has all 10 security regression fixtures (5 vulnerable + 5 safe)", () => {
      const fixtures = fs.readdirSync(fixturesRoot);
      const vulnerableFixtures = fixtures.filter(f => f.startsWith('vulnerable-'));
      const safeFixtures = fixtures.filter(f => f.startsWith('safe-'));
      
      expect(vulnerableFixtures).toHaveLength(5);
      expect(safeFixtures).toHaveLength(5);
      expect(fixtures.length).toBeGreaterThanOrEqual(10);
    });
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { repoRoot } from "./helpers/registry-fixtures";

function writeHookFixture(tmpDir: string, scriptBody: string) {
  const hookDir = path.join(tmpDir, "content", "hooks");
  fs.mkdirSync(hookDir, { recursive: true });
  fs.writeFileSync(
    path.join(hookDir, "example-hook.mdx"),
    `---
title: Example Hook
slug: example-hook
category: hooks
description: Example hook used by validation tests.
cardDescription: Example hook used by validation tests.
scriptLanguage: bash
scriptBody: |-
${scriptBody
  .split("\n")
  .map((line) => `  ${line}`)
  .join("\n")}
---

Example hook body.
`,
    "utf8",
  );
}

function runContentValidation(tmpDir: string) {
  return execFileSync(
    process.execPath,
    [path.join(repoRoot, "scripts/validate-content.mjs"), "--category", "hooks"],
    {
      cwd: tmpDir,
      encoding: "utf8",
      stdio: "pipe",
    },
  );
}

describe("content validation", () => {
  it("rejects hook scriptBody values that are not valid bash", () => {
    const tmpDir = fs.mkdtempSync(
      path.join(os.tmpdir(), "heyclaude-content-validation-"),
    );
    writeHookFixture(
      tmpDir,
      [
        "#!/bin/bash",
        "printf '%s' \"$ACCUMULATED\" | python3 -c '",
        "print(\"the user's dashboard\")",
        "'",
      ].join("\n"),
    );

    expect(() => runContentValidation(tmpDir)).toThrow(
      /scriptBody failed bash syntax check/,
    );
  });

  it("accepts hook scriptBody values that are valid bash", () => {
    const tmpDir = fs.mkdtempSync(
      path.join(os.tmpdir(), "heyclaude-content-validation-"),
    );
    writeHookFixture(
      tmpDir,
      [
        "#!/bin/bash",
        "printf '%s' \"$ACCUMULATED\" | python3 -c '",
        "print(\"the user dashboard\")",
        "'",
      ].join("\n"),
    );

    expect(runContentValidation(tmpDir)).toContain("Content validation passed.");
  });
});
