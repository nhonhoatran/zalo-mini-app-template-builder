import { describe, it, expect } from "vitest";
import { BuilderConfig } from "@zalo-builder/schema";
import {
  runComplianceCheck,
  emitMarkdownReport,
  appNameFormatRule,
  noPlaceholderContentRule,
  noUnfinishedFeaturesRule,
  privacyPolicyPresentRule,
  permissionsMinimalRule,
  noExternalLinksRule,
  noSensitivePaymentRule,
  descriptionMatchesBlocksRule,
  manualChecklistRule,
} from "./index";

const validCleanBuilderConfig: BuilderConfig = {
  version: 1,
  app: {
    name: "Tiệm Cà Phê Siêu Tốc",
    description: "Ứng dụng xem menu sản phẩm và đặt hàng cà phê tiện lợi tại cửa hàng.",
    primaryColor: "#006af5",
    oaId: "123456789",
    locale: "vi",
  },
  pages: [
    {
      id: "page_home",
      title: "Trang chủ",
      path: "/",
      showInTabBar: true,
      icon: "zi-home",
      blocks: [
        {
          id: "b_banner",
          type: "banner",
          props: {
            images: ["https://zapps.vn/custom-banner.jpg"],
            autoplay: true,
            height: "vua",
          },
        },
        {
          id: "b_products",
          type: "product-list",
          props: {
            title: "Menu Cà Phê",
            products: [
              { id: "custom_p1", name: "Cà phê sữa đá", price: "29.000đ", image: "https://zapps.vn/p1.jpg" },
              { id: "custom_p2", name: "Bạc xỉu", price: "32.000đ", image: "https://zapps.vn/p2.jpg" },
            ],
          },
        },
        {
          id: "b_privacy",
          type: "privacy-policy",
          props: {
            appName: "Tiệm Cà Phê Siêu Tốc",
            contactEmail: "cskh@tiemcaphe.vn",
            updatedAt: "2026-07-27",
          },
        },
      ],
    },
  ],
  permissions: [],
  generated: {
    at: "2026-07-27T08:00:00Z",
    builderVersion: "1.0.0",
  },
};

describe("Compliance Rules Unit Tests", () => {
  describe("ZMA-006: appNameFormatRule", () => {
    it("passes for valid app name", () => {
      const issues = appNameFormatRule.check({ builder: validCleanBuilderConfig });
      expect(issues).toHaveLength(0);
    });

    it("fails when app name is ALL UPPERCASE", () => {
      const config: BuilderConfig = {
        ...validCleanBuilderConfig,
        app: { ...validCleanBuilderConfig.app, name: "TIỆM CÀ PHÊ SIÊU TỐC" },
      };
      const issues = appNameFormatRule.check({ builder: config });
      expect(issues.length).toBeGreaterThan(0);
      expect(issues[0].ruleCode).toBe("ZMA-006");
      expect(issues[0].message).toContain("IN HOA toàn bộ");
    });

    it("fails when app name contains special characters", () => {
      const config: BuilderConfig = {
        ...validCleanBuilderConfig,
        app: { ...validCleanBuilderConfig.app, name: "Tiệm Cà Phê %$#@!" },
      };
      const issues = appNameFormatRule.check({ builder: config });
      expect(issues.length).toBeGreaterThan(0);
      expect(issues[0].ruleCode).toBe("ZMA-006");
      expect(issues[0].message).toContain("ký tự đặc biệt");
    });
  });

  describe("ZMA-001: noPlaceholderContentRule", () => {
    it("passes when defaultProps sample data is replaced", () => {
      const issues = noPlaceholderContentRule.check({ builder: validCleanBuilderConfig });
      expect(issues).toHaveLength(0);
    });

    it("fails when block still uses default sample data", () => {
      const config: BuilderConfig = {
        ...validCleanBuilderConfig,
        pages: [
          {
            id: "page_home",
            title: "Trang chủ",
            path: "/",
            showInTabBar: true,
            icon: "zi-home",
            blocks: [
              {
                id: "b_banner_default",
                type: "banner",
                props: {
                  images: [
                    "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80",
                  ],
                },
              },
            ],
          },
        ],
      };
      const issues = noPlaceholderContentRule.check({ builder: config });
      expect(issues.length).toBeGreaterThan(0);
      expect(issues[0].ruleCode).toBe("ZMA-001");
    });
  });

  describe("ZMA-002: noUnfinishedFeaturesRule", () => {
    it("passes when no unfinished keywords exist", () => {
      const issues = noUnfinishedFeaturesRule.check({ builder: validCleanBuilderConfig });
      expect(issues).toHaveLength(0);
    });

    it("fails when containing 'coming soon' or 'đang phát triển'", () => {
      const config: BuilderConfig = {
        ...validCleanBuilderConfig,
        pages: [
          {
            ...validCleanBuilderConfig.pages[0],
            blocks: [
              {
                id: "b_rich",
                type: "rich-text",
                props: {
                  content: "Tính năng ví ưu đãi đang phát triển, coming soon!",
                },
              },
            ],
          },
        ],
      };
      const issues = noUnfinishedFeaturesRule.check({ builder: config });
      expect(issues.length).toBeGreaterThan(0);
      expect(issues[0].ruleCode).toBe("ZMA-002");
    });
  });

  describe("ZMA-003: privacyPolicyPresentRule", () => {
    it("passes when privacy-policy block is included", () => {
      const issues = privacyPolicyPresentRule.check({ builder: validCleanBuilderConfig });
      expect(issues).toHaveLength(0);
    });

    it("fails when privacy-policy block and page are missing", () => {
      const config: BuilderConfig = {
        ...validCleanBuilderConfig,
        pages: [
          {
            id: "p1",
            title: "Trang chủ",
            path: "/",
            showInTabBar: true,
            icon: "zi-home",
            blocks: [
              {
                id: "b1",
                type: "banner",
                props: { images: ["https://zapps.vn/banner.jpg"] },
              },
            ],
          },
        ],
      };
      const issues = privacyPolicyPresentRule.check({ builder: config });
      expect(issues.length).toBe(1);
      expect(issues[0].ruleCode).toBe("ZMA-003");
    });
  });

  describe("ZMA-004: permissionsMinimalRule", () => {
    it("passes when declared permissions match derived permissions", () => {
      const issues = permissionsMinimalRule.check({ builder: validCleanBuilderConfig });
      expect(issues).toHaveLength(0);
    });

    it("fails when declaring unused permission like 'location'", () => {
      const config: BuilderConfig = {
        ...validCleanBuilderConfig,
        permissions: ["location", "phoneNumber"],
      };
      const issues = permissionsMinimalRule.check({ builder: config });
      expect(issues.length).toBe(1);
      expect(issues[0].ruleCode).toBe("ZMA-004");
      expect(issues[0].message).toContain("location");
    });
  });

  describe("ZMA-005: noExternalLinksRule", () => {
    it("passes when using Zalo domain links", () => {
      const issues = noExternalLinksRule.check({ builder: validCleanBuilderConfig });
      expect(issues).toHaveLength(0);
    });

    it("fails when linking to external sites like facebook.com", () => {
      const config: BuilderConfig = {
        ...validCleanBuilderConfig,
        pages: [
          {
            ...validCleanBuilderConfig.pages[0],
            blocks: [
              {
                id: "b1",
                type: "rich-text",
                props: {
                  content: "Ghé thăm fanpage tại https://facebook.com/mybrand",
                },
              },
            ],
          },
        ],
      };
      const issues = noExternalLinksRule.check({ builder: config });
      expect(issues.length).toBe(1);
      expect(issues[0].ruleCode).toBe("ZMA-005");
      expect(issues[0].message).toContain("https://facebook.com/mybrand");
    });
  });

  describe("ZMA-007: noSensitivePaymentRule", () => {
    it("passes when no sensitive financial terms exist", () => {
      const issues = noSensitivePaymentRule.check({ builder: validCleanBuilderConfig });
      expect(issues).toHaveLength(0);
    });

    it("triggers warning for 'nạp tiền' or 'đổi điểm'", () => {
      const config: BuilderConfig = {
        ...validCleanBuilderConfig,
        app: {
          ...validCleanBuilderConfig.app,
          description: "Ứng dụng nạp tiền thẻ cào và đổi điểm thưởng lấy quà.",
        },
      };
      const issues = noSensitivePaymentRule.check({ builder: config });
      expect(issues.length).toBeGreaterThan(0);
      expect(issues[0].ruleCode).toBe("ZMA-007");
      expect(issues[0].severity).toBe("warning");
    });
  });

  describe("ZMA-008: descriptionMatchesBlocksRule", () => {
    it("passes when described features match included blocks", () => {
      const issues = descriptionMatchesBlocksRule.check({ builder: validCleanBuilderConfig });
      expect(issues).toHaveLength(0);
    });

    it("triggers warning when description mentions 'đặt lịch' but no booking-form block exists", () => {
      const config: BuilderConfig = {
        ...validCleanBuilderConfig,
        app: {
          ...validCleanBuilderConfig.app,
          description: "Ứng dụng hỗ trợ đặt lịch hẹn dịch vụ tư vấn online.",
        },
      };
      const issues = descriptionMatchesBlocksRule.check({ builder: config });
      expect(issues.length).toBe(1);
      expect(issues[0].ruleCode).toBe("ZMA-008");
      expect(issues[0].severity).toBe("warning");
      expect(issues[0].message).toContain("Đặt lịch hẹn");
    });
  });

  describe("ZMA-009: manualChecklistRule", () => {
    it("returns info checklist items", () => {
      const issues = manualChecklistRule.check({ builder: validCleanBuilderConfig });
      expect(issues.length).toBe(4);
      expect(issues.every((i) => i.severity === "info")).toBe(true);
    });
  });
});

describe("Milestone M3: Intentional Violation of ALL 9 Rules", () => {
  it("captures violations for all 9 compliance rules in a single runner check", () => {
    const violatingAppConfig: BuilderConfig = {
      version: 1,
      app: {
        name: "ỨNG DỤNG TIỆM VÍ NẠP TIỀN SẮP RA MẮT %#$@", // Fails ZMA-006 (ALL CAPS/Special)
        description: "Ứng dụng hỗ trợ đặt lịch hẹn và nạp tiền đổi điểm thưởng trực tiếp.", // Fails ZMA-008 (no booking block) & ZMA-007 (nạp tiền / đổi điểm)
        primaryColor: "#006af5",
        oaId: "9999",
        locale: "vi",
      },
      pages: [
        {
          id: "page_main",
          title: "Trang chủ",
          path: "/",
          showInTabBar: true,
          icon: "zi-home",
          blocks: [
            {
              id: "block_banner_sample",
              type: "banner",
              props: {
                images: [
                  "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80",
                ], // Fails ZMA-001 (sample data)
              },
            },
            {
              id: "block_unfinished",
              type: "rich-text",
              props: {
                content: "Tính năng đổi quà đang phát triển coming soon!", // Fails ZMA-002 (unfinished terms)
              },
            },
            {
              id: "block_ext_link",
              type: "contact-info",
              props: {
                title: "Liên hệ chúng tôi",
                website: "https://external-bank-scam.com", // Fails ZMA-005 (external URL)
              },
            },
          ],
        },
      ],
      permissions: ["location", "phoneNumber"], // Fails ZMA-004 (permissions minimal, no block asks for location/phoneNumber)
      generated: {
        at: "2026-07-27T08:00:00Z",
        builderVersion: "1.0.0",
      },
    };
    // Also missing privacy-policy block -> Fails ZMA-003

    const report = runComplianceCheck(violatingAppConfig);

    expect(report.passed).toBe(false);
    expect(report.errorsCount).toBeGreaterThan(0);

    const ruleCodesCaptured = new Set(report.issues.map((i) => i.ruleCode));

    expect(ruleCodesCaptured.has("ZMA-001")).toBe(true);
    expect(ruleCodesCaptured.has("ZMA-002")).toBe(true);
    expect(ruleCodesCaptured.has("ZMA-003")).toBe(true);
    expect(ruleCodesCaptured.has("ZMA-004")).toBe(true);
    expect(ruleCodesCaptured.has("ZMA-005")).toBe(true);
    expect(ruleCodesCaptured.has("ZMA-006")).toBe(true);
    expect(ruleCodesCaptured.has("ZMA-007")).toBe(true);
    expect(ruleCodesCaptured.has("ZMA-008")).toBe(true);
    expect(ruleCodesCaptured.has("ZMA-009")).toBe(true);

    // Markdown export generation test
    const markdown = emitMarkdownReport(report, violatingAppConfig.app.name);
    expect(markdown).toContain("Báo Cáo Kiểm Duyệt Zalo Mini App");
    expect(markdown).toContain("ZMA-001");
    expect(markdown).toContain("ZMA-006");
  });
});
