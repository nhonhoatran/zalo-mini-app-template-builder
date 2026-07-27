import { describe, it, expect } from "vitest";
import { buildZip } from "./build-zip";
import { VirtualFileTree } from "@zalo-builder/generator";

describe("buildZip", () => {
  it("compresses VirtualFileTree into a JSZip Blob", async () => {
    const sampleTree: VirtualFileTree = [
      { path: "app-config.json", content: '{"app":{"title":"Test"}}' },
      { path: "src/app.tsx", content: "console.log('hello');" },
      { path: "builder.json", content: '{"version":1}' },
    ];

    const blob = await buildZip(sampleTree);

    expect(blob).toBeDefined();
    expect(blob.size).toBeGreaterThan(0);
    expect(blob.type).toBe("application/zip");
  });
});
