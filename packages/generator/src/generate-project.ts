import {
  BuilderConfig,
  parseAndValidateBuilderConfig,
} from "@zalo-builder/schema";
import { getBaseAppTemplate } from "./templates/base-app";
import { emitAppConfig } from "./emit-app-config";
import { collectBlockFiles } from "./collect-block-files";
import { emitPage } from "./emit-page";
import { emitPrivacyPage } from "./emit-privacy-page";
import { emitRouter } from "./emit-router";
import { emitPackageJson } from "./emit-package-json";
import { emitReadme } from "./emit-readme";
import { mergeFileTrees, VirtualFileTree } from "./virtual-file-tree";

export interface GenerateProjectOptions {
  /**
   * Raw builder.json object or pre-parsed BuilderConfig.
   */
  config: unknown;
}

/**
 * Generate full VirtualFileTree for Zalo Mini App project from builder.json config.
 * Runs 100% in browser (no Node.js 'fs' calls).
 */
export function generateProject(options: GenerateProjectOptions): VirtualFileTree {
  // 1. Validate & enrich permissions
  const validatedConfig: BuilderConfig = parseAndValidateBuilderConfig(options.config);

  // 2. Base App Template
  const baseTree = getBaseAppTemplate();
  const basePkgFile = baseTree.find((f) => f.path === "package.json");
  const basePkgContent = basePkgFile ? basePkgFile.content : "{}";

  // 3. Emit App Config
  const appConfigFile = emitAppConfig(validatedConfig.app);

  // 4. Collect Block Files & Extra Dependencies
  const { files: blockFiles, dependencies: blockDeps } = collectBlockFiles(validatedConfig);

  // 5. Emit Pages
  const pageFiles = validatedConfig.pages.map((p) => emitPage(p));

  // 6. Emit Privacy Page
  const privacyPageFile = emitPrivacyPage(validatedConfig.app);

  // 7. Emit Router
  const routerFile = emitRouter(validatedConfig.pages);

  // 8. Emit Package JSON
  const pkgFile = emitPackageJson(basePkgContent, blockDeps, validatedConfig.app.name);

  // 9. Emit README
  const readmeFile = emitReadme(validatedConfig);

  // 10. Embed builder.json into output for re-import
  const embeddedBuilderFile = {
    path: "builder.json",
    content: JSON.stringify(validatedConfig, null, 2),
  };

  // 11. Merge all file trees (later files override base template)
  const finalTree = mergeFileTrees(
    [
      baseTree,
      [appConfigFile],
      blockFiles,
      pageFiles,
      [privacyPageFile],
      [routerFile],
      [pkgFile],
      [readmeFile],
      [embeddedBuilderFile],
    ],
    { overwrite: true }
  );

  return finalTree;
}
