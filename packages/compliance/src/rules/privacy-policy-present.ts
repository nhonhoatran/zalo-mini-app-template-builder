import { ComplianceRule, ComplianceIssue } from "../rule-type";

export const privacyPolicyPresentRule: ComplianceRule = {
  code: "ZMA-003",
  title: "Thiếu thông tin Chính sách bảo mật",
  severity: "error",
  source: "Zalo Mini App Policy — lỗi #3: Quyền riêng tư & bảo mật",
  check(ctx) {
    const issues: ComplianceIssue[] = [];

    let hasPrivacyBlock = false;
    let hasPrivacyPage = false;

    ctx.builder.pages.forEach((page) => {
      if (
        page.path === "/privacy" ||
        page.path === "/privacy-policy" ||
        page.path === "/chinh-sach-bao-mat"
      ) {
        hasPrivacyPage = true;
      }
      page.blocks.forEach((block) => {
        if (block.type === "privacy-policy") {
          hasPrivacyBlock = true;
        }
      });
    });

    if (!hasPrivacyBlock && !hasPrivacyPage) {
      issues.push({
        ruleCode: "ZMA-003",
        ruleTitle: this.title,
        severity: "error",
        message: "Ứng dụng chưa có khối hoặc trang 'Chính sách bảo mật' (Privacy Policy). Zalo bắt buộc mọi Mini App phải công khai điều khoản này.",
        fix: "Thêm block 'privacy-policy' (Chính sách bảo mật) vào trang cài đặt hoặc tạo trang '/privacy-policy'.",
        source: this.source,
        location: { fieldPath: "pages" },
      });
    }

    return issues;
  },
};
