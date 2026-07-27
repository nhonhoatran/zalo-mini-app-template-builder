import { ComplianceRule, ComplianceIssue } from "../rule-type";

const SENSITIVE_PAYMENT_KEYWORDS = [
  "nạp tiền",
  "đổi điểm",
  "rút tiền",
  "đổi quà thành tiền",
  "rút về ngân hàng",
  "quy đổi tiền mặt",
  "chuyển khoản trực tiếp",
  "nạp game",
  "đổi thẻ cào",
];

function findSensitiveStrings(obj: unknown, path: string): { path: string; match: string }[] {
  const results: { path: string; match: string }[] = [];
  if (typeof obj === "string") {
    const lower = obj.toLowerCase();
    for (const kw of SENSITIVE_PAYMENT_KEYWORDS) {
      if (lower.includes(kw)) {
        results.push({ path, match: kw });
        break;
      }
    }
  } else if (Array.isArray(obj)) {
    obj.forEach((item, idx) => {
      results.push(...findSensitiveStrings(item, `${path}[${idx}]`));
    });
  } else if (obj !== null && typeof obj === "object") {
    Object.entries(obj).forEach(([key, val]) => {
      results.push(...findSensitiveStrings(val, path ? `${path}.${key}` : key));
    });
  }
  return results;
}

export const noSensitivePaymentRule: ComplianceRule = {
  code: "ZMA-007",
  title: "Nghi vấn tính năng thanh toán nhạy cảm",
  severity: "warning",
  source: "Zalo Mini App Policy — lỗi #2 & #7: Quy định dịch vụ tài chính & nạp tiền",
  check(ctx) {
    const issues: ComplianceIssue[] = [];

    // Check app description
    const appMatches = findSensitiveStrings(ctx.builder.app, "app");
    appMatches.forEach((m) => {
      issues.push({
        ruleCode: "ZMA-007",
        ruleTitle: this.title,
        severity: "warning",
        message: `Thông tin ứng dụng có chứa thuật ngữ tài chính nhạy cảm ("${m.match}"). Zalo có quy định rất nghiêm ngặt về ví điện tử / điểm thưởng.`,
        fix: "Đảm bảo ứng dụng không cho phép quy đổi điểm thưởng ra tiền mặt hoặc ví cá nhân. Đăng ký giấy phép cổng thanh toán nếu cần.",
        source: this.source,
        location: { fieldPath: m.path },
      });
    });

    // Check pages & blocks
    ctx.builder.pages.forEach((page, pIdx) => {
      page.blocks.forEach((block, bIdx) => {
        const blockMatches = findSensitiveStrings(
          block.props,
          `pages[${pIdx}].blocks[${bIdx}].props`
        );
        blockMatches.forEach((m) => {
          issues.push({
            ruleCode: "ZMA-007",
            ruleTitle: this.title,
            severity: "warning",
            message: `Block "${block.type}" (trang "${page.title}") có từ khóa liên quan đến quy đổi tiền/điểm ("${m.match}").`,
            fix: "Kiểm tra kỹ luồng thanh toán, chỉ sử dụng dịch vụ thanh toán hợp lệ được Zalo chấp thuận.",
            source: this.source,
            location: {
              pageId: page.id,
              blockId: block.id,
              fieldPath: m.path,
            },
          });
        });
      });
    });

    return issues;
  },
};
