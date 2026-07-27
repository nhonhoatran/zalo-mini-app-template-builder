import { VirtualFileTree } from "../virtual-file-tree";

/**
 * Minimalist Zalo Mini App Base Template
 * Pure TypeScript string definitions so it runs 100% in browser client-side without Node.js 'fs'.
 */
export function getBaseAppTemplate(): VirtualFileTree {
  return [
    {
      path: "package.json",
      content: JSON.stringify(
        {
          name: "zalo-mini-app",
          version: "1.0.0",
          private: true,
          type: "module",
          scripts: {
            dev: "zmp start",
            start: "zmp start",
            build: "zmp deploy",
            typecheck: "tsc --noEmit",
          },
          dependencies: {
            react: "^18.2.0",
            "react-dom": "^18.2.0",
            "react-router-dom": "^6.22.0",
            "zmp-sdk": "^2.51.8",
            "zmp-ui": "^1.11.14",
          },
          devDependencies: {
            "@types/react": "^18.2.0",
            "@types/react-dom": "^18.2.0",
            "@vitejs/plugin-react": "^4.2.0",
            typescript: "^5.4.0",
            vite: "^5.4.0",
            "zmp-cli": "^4.0.3",
          },
        },
        null,
        2
      ),
    },
    {
      path: "vite.config.ts",
      content: `import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "./",
  build: {
    outDir: "www",
  },
});
`,
    },
    {
      path: "tsconfig.json",
      content: JSON.stringify(
        {
          compilerOptions: {
            target: "ES2020",
            useDefineForClassFields: true,
            lib: ["ES2020", "DOM", "DOM.Iterable"],
            module: "ESNext",
            skipLibCheck: true,
            moduleResolution: "bundler",
            allowImportingTsExtensions: true,
            resolveJsonModule: true,
            isolatedModules: true,
            noEmit: true,
            jsx: "react-jsx",
            strict: true,
            noUnusedLocals: true,
            noUnusedParameters: true,
            noFallthroughCasesInSwitch: true,
          },
          include: ["src"],
        },
        null,
        2
      ),
    },
    {
      path: "index.html",
      content: `<!DOCTYPE html>
<html lang="vi">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <title>Zalo Mini App</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/app.tsx"></script>
  </body>
</html>
`,
    },
    {
      path: "src/css/app.css",
      content: `/* Base Zalo UI Styles & CSS Variables */
@import "zmp-ui/zmp-ui.css";

:root {
  --zmp-primary-color: #006af5;
}

body {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  background-color: #f4f5f7;
  color: #141415;
}

.page {
  padding-bottom: 60px;
}
`,
    },
    {
      path: "src/services/zalo-bridge.ts",
      content: `/**
 * Safe Zalo SDK Bridge.
 * Gracefully fallbacks to mock data when running in browser web environment.
 */
import { getSystemInfoSync } from "zmp-sdk";

export function isZaloEnvironment(): boolean {
  try {
    const info = getSystemInfoSync();
    return Boolean(info && info.platform);
  } catch {
    return false;
  }
}

export async function getUserInfoSafe() {
  if (!isZaloEnvironment()) {
    return {
      userInfo: {
        id: "mock_user_123",
        name: "Người dùng Khách",
        avatar: "https://h5.zdn.vn/static/images/avatar.png",
      },
    };
  }
  const { getUserInfo } = await import("zmp-sdk");
  return getUserInfo({});
}
`,
    },
  ];
}
