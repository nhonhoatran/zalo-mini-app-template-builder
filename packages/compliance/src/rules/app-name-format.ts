import { ComplianceRule, ComplianceIssue } from "../rule-type";

export const appNameFormatRule: ComplianceRule = {
  code: "ZMA-006",
  title: "Tên Mini App không hợp lệ",
  severity: "error",
  source: "Zalo Mini App Policy — lỗi #6: Định dạng tên ứng dụng",
  check(ctx) {
    const issues: ComplianceIssue[] = [];
    const name = ctx.builder.app?.name || "";

    if (!name.trim() || name.trim().length < 2) {
      issues.push({
        ruleCode: "ZMA-006",
        ruleTitle: this.title,
        severity: "error",
        message: "Tên Mini App không được để trống và phải có ít nhất 2 ký tự.",
        fix: "Nhập tên thương hiệu hoặc tên ứng dụng ngắn gọn (từ 2 đến 50 ký tự).",
        source: this.source,
        location: { fieldPath: "app.name" },
      });
      return issues;
    }

    // Check uppercase
    const uppercaseChars = name.replace(/[^A-Z]/g, "").length;
    if (name === name.toUpperCase() && uppercaseChars >= 3) {
      const titleCased = name
        .toLowerCase()
        .replace(/(?:^|\s)\S/g, (a) => a.toUpperCase());
      issues.push({
        ruleCode: "ZMA-006",
        ruleTitle: this.title,
        severity: "error",
        message: "Tên Mini App đang viết IN HOA toàn bộ.",
        fix: `Chỉ viết hoa chữ cái đầu từ. Gợi ý: "${titleCased}"`,
        source: this.source,
        location: { fieldPath: "app.name" },
      });
    }

    // Check special characters
    if (/[^\p{L}\p{N}\s\-_&.]/u.test(name)) {
      issues.push({
        ruleCode: "ZMA-006",
        ruleTitle: this.title,
        severity: "error",
        message: "Tên Mini App chứa ký tự đặc biệt không được phép.",
        fix: "Bỏ các biểu tượng lạ hoặc icon emoji. Chỉ giữ lại chữ cái, chữ số, khoảng trắng và các dấu (- _ & .).",
        source: this.source,
        location: { fieldPath: "app.name" },
      });
    }

    return issues;
  },
};
