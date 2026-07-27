export interface VirtualFile {
  /** Relative path in project, e.g. "src/pages/home.tsx", "app-config.json" */
  path: string;
  /** Text content of the file */
  content: string;
}

export type VirtualFileTree = VirtualFile[];

/**
 * Find duplicate file paths in a file tree.
 */
export function findDuplicatePaths(tree: VirtualFileTree): string[] {
  const seen = new Set<string>();
  const duplicates = new Set<string>();

  for (const file of tree) {
    const normalizedPath = normalizePath(file.path);
    if (seen.has(normalizedPath)) {
      duplicates.add(normalizedPath);
    } else {
      seen.add(normalizedPath);
    }
  }

  return Array.from(duplicates);
}

/**
 * Merge multiple VirtualFileTrees into one.
 * If overwrite is true, later files overwrite earlier files with the same path.
 * If overwrite is false and duplicates exist, throws an Error.
 */
export function mergeFileTrees(
  trees: VirtualFileTree[],
  options: { overwrite?: boolean } = {}
): VirtualFileTree {
  const { overwrite = false } = options;
  const fileMap = new Map<string, VirtualFile>();

  for (const tree of trees) {
    for (const file of tree) {
      const normalizedPath = normalizePath(file.path);
      if (!overwrite && fileMap.has(normalizedPath)) {
        throw new Error(`Duplicate file path detected in VirtualFileTree: "${normalizedPath}"`);
      }
      fileMap.set(normalizedPath, {
        path: normalizedPath,
        content: file.content,
      });
    }
  }

  return Array.from(fileMap.values());
}

/**
 * Normalize path separators to forward slashes and trim leading slashes.
 */
export function normalizePath(pathStr: string): string {
  return pathStr.replace(/\\/g, "/").replace(/^\/+/, "");
}
