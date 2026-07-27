import { ComplianceRule, ComplianceIssue } from "../rule-type";
import { MvpBlockType } from "@zalo-builder/schema";

interface FeatureMapping {
  keywords: string[];
  expectedBlocks: MvpBlockType[];
  featureName: string;
}

const FEATURE_MAPPINGS: FeatureMapping[] = [
  {
    keywords: ["đặt lịch", "hẹn lịch", "đặt hẹn", "booking"],
    expectedBlocks: ["booking-form"],
    featureName: "Đặt lịch hẹn",
  },
  {
    keywords: ["mua hàng", "đặt hàng", "giỏ hàng", "sản phẩm", "cửa hàng"],
    expectedBlocks: ["product-list", "product-detail", "cart-button"],
    featureName: "Mua sắm / Giỏ hàng",
  },
  {
    keywords: ["bản đồ", "chỉ đường", "vị trí", "tìm đường"],
    expectedBlocks: ["map-location", "contact-info"],
    featureName: "Bản đồ / Vị trí",
  },
  {
    keywords: ["bảng giá", "thực đơn", "menu dịch vụ"],
    expectedBlocks: ["service-price-list", "product-list"],
    featureName: "Bảng giá / Menu dịch vụ",
  },
];

export const descriptionMatchesBlocksRule: ComplianceRule = {
  code: "ZMA-008",
  title: "Mô tả ứng dụng không khớp với tính năng thực tế",
  severity: "warning",
  source: "Zalo Mini App Policy — lỗi #5: Mô tả sai lệch so với chức năng",
  check(ctx) {
    const issues: ComplianceIssue[] = [];
    const desc = (ctx.builder.app?.description || "").toLowerCase();
    if (!desc) return issues;

    // Collect all present block types across all pages
    const presentBlockTypes = new Set<MvpBlockType>();
    ctx.builder.pages.forEach((page) => {
      page.blocks.forEach((block) => {
        presentBlockTypes.add(block.type);
      });
    });

    FEATURE_MAPPINGS.forEach((mapping) => {
      const matchedKeyword = mapping.keywords.find((kw) => desc.includes(kw));
      if (matchedKeyword) {
        const hasBlock = mapping.expectedBlocks.some((b) => presentBlockTypes.has(b));
        if (!hasBlock) {
          issues.push({
            ruleCode: "ZMA-008",
            ruleTitle: this.title,
            severity: "warning",
            message: `Mô tả ứng dụng đề cập tính năng "${mapping.featureName}" (từ khóa "${matchedKeyword}") nhưng chưa tìm thấy block tương ứng trong ứng dụng.`,
            fix: `Thêm ít nhất 1 block thuộc nhóm [${mapping.expectedBlocks.join(
              ", "
            )}] hoặc điều chỉnh lại câu từ trong phần mô tả ứng dụng.`,
            source: this.source,
            location: { fieldPath: "app.description" },
          });
        }
      }
    });

    return issues;
  },
};
