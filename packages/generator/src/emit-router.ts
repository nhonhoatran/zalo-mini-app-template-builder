import { PageConfig } from "@zalo-builder/schema";
import { VirtualFile } from "./virtual-file-tree";
import { getPageFileName, toPascalCase } from "./emit-page";

export function emitRouter(pages: PageConfig[]): VirtualFile {
  const pageImports: string[] = [];
  const routeElements: string[] = [];
  const tabBarItems: string[] = [];

  // Track pages processed
  const processedPaths = new Set<string>();

  for (const page of pages) {
    const compName = `${toPascalCase(page.id)}Page`;
    const fileName = getPageFileName(page.id).replace(/\.tsx$/, "");
    pageImports.push(`import ${compName} from "./pages/${fileName}";`);
    routeElements.push(`          <Route path=${JSON.stringify(page.path)} element={<${compName} />} />`);
    processedPaths.add(page.path);

    if (page.showInTabBar) {
      const icon = page.icon || "zi-home";
      tabBarItems.push(
        `          <BottomNavigation.Item key=${JSON.stringify(page.path)} label=${JSON.stringify(
          page.title
        )} icon={<Icon icon=${JSON.stringify(icon)} />} />`
      );
    }
  }

  // Ensure Privacy Policy page route exists
  if (!processedPaths.has("/privacy")) {
    pageImports.push(`import PrivacyPage from "./pages/privacy";`);
    routeElements.push(`          <Route path="/privacy" element={<PrivacyPage />} />`);
  }

  const tabBarJsx =
    tabBarItems.length > 0
      ? `\n        <BottomNavigation activeKey={window.location.pathname}>\n${tabBarItems.join(
          "\n"
        )}\n        </BottomNavigation>`
      : "";

  const content = `import React from "react";
import { createRoot } from "react-dom/client";
import { App, ZMPRouter, AnimationRoutes, Route, BottomNavigation, Icon } from "zmp-ui";
import "./css/app.css";

${pageImports.join("\n")}

export function RootApp() {
  return (
    <App>
      <ZMPRouter>
        <AnimationRoutes>
${routeElements.join("\n")}
        </AnimationRoutes>${tabBarJsx}
      </ZMPRouter>
    </App>
  );
}

const container = document.getElementById("app");
if (container) {
  const root = createRoot(container);
  root.render(<RootApp />);
}
`;

  return {
    path: "src/app.tsx",
    content,
  };
}
