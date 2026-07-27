import { BuilderConfig, MvpBlockType } from "@zalo-builder/schema";
import { BLOCK_REGISTRY, BlockManifest } from "../../blocks/src/index";
import { VirtualFileTree } from "./virtual-file-tree";

export const BLOCK_MANIFEST_REGISTRY = BLOCK_REGISTRY;

/**
 * Collect all block component files required by the builder config.
 */
export function collectBlockFiles(builderConfig: BuilderConfig): {
  files: VirtualFileTree;
  dependencies: Record<string, string>;
} {
  const usedTypes = new Set<MvpBlockType>();

  // Always collect privacy-policy block
  usedTypes.add("privacy-policy");

  for (const page of builderConfig.pages) {
    for (const block of page.blocks) {
      usedTypes.add(block.type);
    }
  }

  const files: VirtualFileTree = [];
  const dependencies: Record<string, string> = {};

  for (const blockType of usedTypes) {
    const manifest = BLOCK_REGISTRY[blockType];
    if (manifest) {
      files.push({
        path: manifest.componentPath,
        content: manifest.componentContent,
      });

      if (manifest.dependencies) {
        Object.assign(dependencies, manifest.dependencies);
      }
    }
  }

  return { files, dependencies };
}
