import { ComplianceRule, ComplianceIssue } from "../rule-type";
import { getBlockManifest } from "@zalo-builder/blocks";

export const noPlaceholderContentRule: ComplianceRule = {
  code: "ZMA-001",
  title: "Còn dữ liệu mẫu chưa thay đổi",
  severity: "error",
  source: "Zalo Mini App Policy — lỗi #1: Dữ liệu mẫu / Placeholder content",
  check(ctx) {
    const issues: ComplianceIssue[] = [];

    ctx.builder.pages.forEach((page, pIdx) => {
      page.blocks.forEach((block, bIdx) => {
        try {
          const manifest = getBlockManifest(block.type);
          if (manifest && typeof manifest.usesSampleData === "function") {
            const propsToTest = {
              ...manifest.defaultProps,
              ...(block.props || {}),
            };
            if (manifest.usesSampleData(propsToTest)) {
              issues.push({
                ruleCode: "ZMA-001",
                ruleTitle: this.title,
                severity: "error",
                message: `Block "${manifest.label}" (trang "${page.title}") còn sử dụng dữ liệu mẫu mặc định chưa được cập nhật.`,
                fix: "Thay thế các hình ảnh, văn bản hoặc danh sách sản phẩm/dịch vụ mẫu bằng thông tin thật của cửa hàng.",
                source: this.source,
                location: {
                  pageId: page.id,
                  blockId: block.id,
                  fieldPath: `pages[${pIdx}].blocks[${bIdx}].props`,
                },
              });
            }
          }
        } catch {
          // Ignore lookup errors
        }
      });
    });

    return issues;
  },
};
