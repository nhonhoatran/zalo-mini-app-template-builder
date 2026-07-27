import { describe, it, expect } from "vitest";
import {
  BuilderSchema,
  parseAndValidateBuilderConfig,
  derivePermissions,
  MVP_BLOCK_TYPES,
  BLOCK_REQUIRED_PERMISSIONS,
} from "./builder-schema.js";

describe("Builder Schema & Validation", () => {
  const validSampleConfig = {
    version: 1,
    app: {
      name: "Cà Phê Sáng",
      description: "Ứng dụng đặt cà phê phin nguyên chất",
      primaryColor: "#c0392b",
      oaId: "123456789",
      locale: "vi",
    },
    pages: [
      {
        id: "home",
        title: "Trang chủ",
        path: "/",
        showInTabBar: true,
        icon: "zi-home",
        blocks: [
          { id: "b1", type: "banner", props: { images: ["https://example.com/banner.png"], autoplay: true } },
          { id: "b2", type: "product-list", props: { title: "Thực đơn", source: "mock" } },
        ],
      },
      {
        id: "booking",
        title: "Đặt bàn",
        path: "/booking",
        showInTabBar: true,
        icon: "zi-calendar",
        blocks: [
          { id: "b3", type: "booking-form", props: { title: "Đặt bàn trước" } },
        ],
      },
    ],
    permissions: [],
    generated: {
      at: "2026-07-27T14:00:00Z",
      builderVersion: "1.0.0",
    },
  };

  it("should successfully parse a valid builder.json config", () => {
    const result = BuilderSchema.safeParse(validSampleConfig);
    expect(result.success).toBe(true);
  });

  it("should automatically derive permissions based on used blocks", () => {
    const validated = parseAndValidateBuilderConfig(validSampleConfig);
    // booking-form requires userInfo and phoneNumber
    expect(validated.permissions).toEqual(["phoneNumber", "userInfo"]);
  });

  it("should reject app names written in ALL CAPS", () => {
    const invalidConfig = {
      ...validSampleConfig,
      app: {
        ...validSampleConfig.app,
        name: "CA PHE SANG VIET NAM",
      },
    };
    const result = BuilderSchema.safeParse(invalidConfig);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors[0].message).toContain("IN HOA");
    }
  });

  it("should reject configs without a root path '/' page", () => {
    const invalidConfig = {
      ...validSampleConfig,
      pages: [
        {
          id: "about",
          title: "Giới thiệu",
          path: "/about",
          showInTabBar: false,
          icon: "zi-info",
          blocks: [],
        },
      ],
    };
    const result = BuilderSchema.safeParse(invalidConfig);
    expect(result.success).toBe(false);
  });

  it("should reject pages whose path does not start with '/'", () => {
    const invalidConfig = {
      ...validSampleConfig,
      pages: [
        {
          id: "home",
          title: "Trang chủ",
          path: "home", // missing leading /
          showInTabBar: true,
          icon: "zi-home",
          blocks: [],
        },
      ],
    };
    const result = BuilderSchema.safeParse(invalidConfig);
    expect(result.success).toBe(false);
  });

  it("should contain all 12 MVP block types including system blocks", () => {
    expect(MVP_BLOCK_TYPES.length).toBe(12);
    expect(MVP_BLOCK_TYPES).toContain("banner");
    expect(MVP_BLOCK_TYPES).toContain("product-list");
    expect(MVP_BLOCK_TYPES).toContain("booking-form");
    expect(MVP_BLOCK_TYPES).toContain("privacy-policy");
  });

  it("should accurately map required permissions per block type", () => {
    expect(BLOCK_REQUIRED_PERMISSIONS["booking-form"]).toEqual(["userInfo", "phoneNumber"]);
    expect(BLOCK_REQUIRED_PERMISSIONS["map-location"]).toEqual(["location"]);
    expect(BLOCK_REQUIRED_PERMISSIONS["product-list"]).toEqual([]);
  });
});
