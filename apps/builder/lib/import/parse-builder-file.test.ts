import { describe, it, expect } from "vitest";
import { parseBuilderFile, MAX_FILE_SIZE_BYTES } from "./parse-builder-file";
import { DEFAULT_BUILDER_CONFIG } from "../../store/builder-store";

describe("parseBuilderFile", () => {
  it("parses and validates a valid builder.json string", async () => {
    const validJson = JSON.stringify(DEFAULT_BUILDER_CONFIG);
    const result = await parseBuilderFile(validJson);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.config.app.name).toBe(DEFAULT_BUILDER_CONFIG.app.name);
      expect(result.migrated).toBe(false);
      expect(result.originalVersion).toBe(1);
    }
  });

  it("handles malformed JSON strings gracefully", async () => {
    const invalidJson = "{ version: 1, app: ";
    const result = await parseBuilderFile(invalidJson);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors[0]).toContain("File không đúng định dạng JSON");
    }
  });

  it("returns errors when required schema fields are missing", async () => {
    const badSchema = JSON.stringify({
      version: 1,
      app: {
        // missing name, description, etc.
      },
    });
    const result = await parseBuilderFile(badSchema);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors.length).toBeGreaterThan(0);
    }
  });

  it("migrates older version schema automatically", async () => {
    const legacyConfig = {
      ...DEFAULT_BUILDER_CONFIG,
      version: 1,
    };
    const result = await parseBuilderFile(JSON.stringify(legacyConfig));

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.config.version).toBe(1);
    }
  });
});
