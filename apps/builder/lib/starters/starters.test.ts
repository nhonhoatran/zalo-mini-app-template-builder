import { describe, it, expect } from "vitest";
import { STARTER_TEMPLATES, getStarterTemplateById } from "./index";
import { parseAndValidateBuilderConfig } from "@zalo-builder/schema";
import { runComplianceCheck } from "@zalo-builder/compliance";

describe("Starter Templates Registry", () => {
  it("contains exactly 3 starter templates", () => {
    expect(STARTER_TEMPLATES.length).toBe(3);
  });

  STARTER_TEMPLATES.forEach((starter) => {
    it(`validates schema for starter template: ${starter.name} (${starter.id})`, () => {
      const validated = parseAndValidateBuilderConfig(starter.config);
      expect(validated.app.name).toBe(starter.config.app.name);
      expect(validated.pages.length).toBeGreaterThan(0);
    });

    it(`runs compliance check for starter template: ${starter.name}`, () => {
      const report = runComplianceCheck(starter.config);
      expect(report).toBeDefined();
      expect(report.totalIssues).toBeGreaterThanOrEqual(0);
    });
  });

  it("retrieves template by ID", () => {
    const coffee = getStarterTemplateById("coffee-shop");
    expect(coffee).toBeDefined();
    expect(coffee?.id).toBe("coffee-shop");
  });
});
