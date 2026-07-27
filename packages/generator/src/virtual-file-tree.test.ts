import { describe, it, expect } from "vitest";
import {
  findDuplicatePaths,
  mergeFileTrees,
  normalizePath,
  VirtualFileTree,
} from "./virtual-file-tree";

describe("virtual-file-tree", () => {
  it("normalizes path separators correctly", () => {
    expect(normalizePath("src\\pages\\home.tsx")).toBe("src/pages/home.tsx");
    expect(normalizePath("/src/pages/home.tsx")).toBe("src/pages/home.tsx");
  });

  it("finds duplicate paths", () => {
    const tree: VirtualFileTree = [
      { path: "src/app.tsx", content: "a" },
      { path: "src/app.tsx", content: "b" },
      { path: "app-config.json", content: "c" },
    ];
    expect(findDuplicatePaths(tree)).toEqual(["src/app.tsx"]);
  });

  it("merges trees with overwrite option", () => {
    const tree1: VirtualFileTree = [{ path: "app-config.json", content: "{}" }];
    const tree2: VirtualFileTree = [
      { path: "app-config.json", content: '{"name": "test"}' },
      { path: "src/app.tsx", content: "export default App;" },
    ];

    const merged = mergeFileTrees([tree1, tree2], { overwrite: true });
    expect(merged).toHaveLength(2);
    expect(merged.find((f) => f.path === "app-config.json")?.content).toBe(
      '{"name": "test"}'
    );
  });

  it("throws when duplicate path exists without overwrite", () => {
    const tree1: VirtualFileTree = [{ path: "app-config.json", content: "{}" }];
    const tree2: VirtualFileTree = [{ path: "app-config.json", content: "{}" }];

    expect(() => mergeFileTrees([tree1, tree2])).toThrowError(/Duplicate file path/);
  });
});
