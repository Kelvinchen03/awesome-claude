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
  });
});
