import { describe, it, expect } from "vitest";
import { parseAndValidateBuilderConfig } from "@zalo-builder/schema";
import { collectBlockFiles } from "./collect-block-files";

describe("collectBlockFiles", () => {
  it("collects component files for used blocks and privacy policy automatically", () => {
    const raw = {
      version: 1,
      app: { name: "Test App" },
      pages: [
        {
          id: "home",
          title: "Trang chủ",
          path: "/",
          blocks: [{ id: "b1", type: "banner", props: {} }],
        },
      ],
    };

    const config = parseAndValidateBuilderConfig(raw);
    const { files } = collectBlockFiles(config);

    const paths = files.map((f) => f.path);
    expect(paths).toContain("src/components/blocks/banner.tsx");
    expect(paths).toContain("src/components/blocks/privacy-policy.tsx");
    expect(paths).not.toContain("src/components/blocks/booking-form.tsx");
  });
});
