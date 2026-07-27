import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    globals: true,
  },
  resolve: {
    alias: {
      "zmp-ui": path.resolve(__dirname, "./packages/blocks/src/shared/mock-zmp-ui.tsx"),
      "@zalo-builder/schema": path.resolve(__dirname, "./packages/schema"),
      "@zalo-builder/blocks": path.resolve(__dirname, "./packages/blocks/src"),
      "@zalo-builder/generator": path.resolve(__dirname, "./packages/generator/src"),
    },
  },
});
