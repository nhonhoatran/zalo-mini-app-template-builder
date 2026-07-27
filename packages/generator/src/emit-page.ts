import { PageConfig, MvpBlockType } from "@zalo-builder/schema";
import { VirtualFile } from "./virtual-file-tree";

/**
 * Convert hyphenated identifier to PascalCase component name.
 * e.g. "product-list" -> "ProductList"
 */
export function toPascalCase(str: string): string {
  return str
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase())
    .replace(/^[a-z]/, (chr) => chr.toUpperCase());
}

/**
 * Sanitize page filename: "home" -> "home.tsx", "/home" -> "home.tsx"
 */
export function getPageFileName(pageId: string): string {
  const cleanId = pageId.replace(/^\/+/, "").replace(/[^a-zA-Z0-9_-]/g, "");
  return `${cleanId || "index"}.tsx`;
}

/**
 * Emit a single React Page component TSX file from PageConfig.
 */
export function emitPage(page: PageConfig): VirtualFile {
  const componentName = `${toPascalCase(page.id)}Page`;
  const fileName = getPageFileName(page.id);

  // Track imports for used blocks
  const importedBlocks = new Map<MvpBlockType, string>();
  for (const block of page.blocks) {
    if (!importedBlocks.has(block.type)) {
      const blockCompName = `${toPascalCase(block.type)}Block`;
      importedBlocks.set(block.type, blockCompName);
    }
  }

  // Generate import lines
  const blockImports = Array.from(importedBlocks.entries())
    .map(([type, compName]) => `import ${compName} from "../components/blocks/${type}";`)
    .join("\n");

  // Generate JSX elements for blocks
  const blockElements = page.blocks.map((block) => {
    const compName = importedBlocks.get(block.type)!;
    const propEntries = Object.entries(block.props ?? {});
    
    if (propEntries.length === 0) {
      return `      <${compName} key="${block.id}" />`;
    }

    const formattedProps = propEntries
      .map(([key, val]) => `${key}={${JSON.stringify(val)}}`)
      .join(" ");

    return `      <${compName} key="${block.id}" ${formattedProps} />`;
  });

  const isHomePage = page.path === "/";
  const headerJsx = page.title
    ? `      <Header title=${JSON.stringify(page.title)} showBack={${JSON.stringify(!isHomePage)}} />\n`
    : "";

  const content = `import React from "react";
import { Page, Header } from "zmp-ui";
${blockImports ? blockImports + "\n" : ""}
export default function ${componentName}() {
  return (
    <Page className="page">
${headerJsx}${blockElements.join("\n")}
    </Page>
  );
}
`;

  return {
    path: `src/pages/${fileName}`,
    content,
  };
}
