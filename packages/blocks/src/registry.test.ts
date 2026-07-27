import { describe, it, expect } from "vitest";
import { MVP_BLOCK_TYPES, BLOCK_REQUIRED_PERMISSIONS } from "@zalo-builder/schema";
import { BLOCK_REGISTRY, getAllBlockManifests, getBlockManifest } from "./registry";

describe("Block Registry Test Suite (Phase 03)", () => {
  it("phải chứa đầy đủ 12/12 block types thuộc MVP_BLOCK_TYPES", () => {
    const registeredTypes = Object.keys(BLOCK_REGISTRY);
    expect(registeredTypes).toHaveLength(MVP_BLOCK_TYPES.length);

    for (const type of MVP_BLOCK_TYPES) {
      expect(BLOCK_REGISTRY[type]).toBeDefined();
      expect(BLOCK_REGISTRY[type].type).toBe(type);
    }
  });

  it("defaultProps của tất cả block phải validate thành công qua propsSchema của chính nó", () => {
    const manifests = getAllBlockManifests();
    for (const manifest of manifests) {
      const parseResult = manifest.propsSchema.safeParse(manifest.defaultProps);
      if (!parseResult.success) {
        console.error(`Block '${manifest.type}' defaultProps validation failed:`, parseResult.error.format());
      }
      expect(parseResult.success).toBe(true);
    }
  });

  it("permissions trong manifest phải khớp đúng với BLOCK_REQUIRED_PERMISSIONS của schema", () => {
    for (const type of MVP_BLOCK_TYPES) {
      const manifest = getBlockManifest(type);
      const expectedPermissions = BLOCK_REQUIRED_PERMISSIONS[type];
      expect(manifest.permissions.sort()).toEqual(expectedPermissions.sort());
    }
  });

  it("usesSampleData(defaultProps) phải trả về true cho tất cả block", () => {
    const manifests = getAllBlockManifests();
    for (const manifest of manifests) {
      expect(manifest.usesSampleData(manifest.defaultProps)).toBe(true);
    }
  });
});
