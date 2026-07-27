import { describe, it, expect } from "vitest";
import { generateProject } from "./generate-project";

describe("generateProject", () => {
  it("generates complete VirtualFileTree from a valid builder.json config", () => {
    const rawBuilderConfig = {
      version: 1,
      app: {
        name: "Cà Phê Sáng",
        description: "App đặt cà phê",
        primaryColor: "#006af5",
      },
      pages: [
        {
          id: "home",
          title: "Trang chủ",
          path: "/",
          showInTabBar: true,
          icon: "zi-home",
          blocks: [
            {
              id: "b1",
              type: "banner",
              props: { images: ["https://example.com/b1.jpg"], autoplay: true },
            },
            {
              id: "b2",
              type: "product-list",
              props: { title: "Thực đơn chính" },
            },
          ],
        },
        {
          id: "booking",
          title: "Đặt bàn",
          path: "/booking",
          showInTabBar: true,
          icon: "zi-calendar",
          blocks: [
            {
              id: "b3",
              type: "booking-form",
              props: {},
            },
          ],
        },
      ],
    };

    const tree = generateProject({ config: rawBuilderConfig });
    const paths = tree.map((f) => f.path).sort();

    // Check essential file paths
    expect(paths).toContain("package.json");
    expect(paths).toContain("vite.config.ts");
    expect(paths).toContain("tsconfig.json");
    expect(paths).toContain("index.html");
    expect(paths).toContain("app-config.json");
    expect(paths).toContain("README.md");
    expect(paths).toContain("builder.json");
    expect(paths).toContain("src/app.tsx");
    expect(paths).toContain("src/css/app.css");
    expect(paths).toContain("src/services/zalo-bridge.ts");
    expect(paths).toContain("src/pages/home.tsx");
    expect(paths).toContain("src/pages/booking.tsx");
    expect(paths).toContain("src/pages/privacy.tsx");
    expect(paths).toContain("src/components/blocks/banner.tsx");
    expect(paths).toContain("src/components/blocks/product-list.tsx");
    expect(paths).toContain("src/components/blocks/booking-form.tsx");
    expect(paths).toContain("src/components/blocks/privacy-policy.tsx");

    // Check app-config.json content
    const appConfigFile = tree.find((f) => f.path === "app-config.json");
    expect(JSON.parse(appConfigFile!.content).app.title).toBe("Cà Phê Sáng");

    // Check automatic permission derivation in README & embedded builder.json
    const embeddedBuilderFile = tree.find((f) => f.path === "builder.json");
    const parsedEmbedded = JSON.parse(embeddedBuilderFile!.content);
    expect(parsedEmbedded.permissions).toEqual(["phoneNumber", "userInfo"]);
  });
});
