import { ComplianceRule, ComplianceIssue } from "../rule-type";

const UNFINISHED_KEYWORDS = [
  "đang phát triển",
  "coming soon",
  "todo",
  "chuẩn bị ra mắt",
  "đang cập nhật",
  "sắp ra mắt",
  "under construction",
];

function findUnfinishedStrings(obj: unknown, path: string): { path: string; match: string }[] {
  const results: { path: string; match: string }[] = [];
  if (typeof obj === "string") {
    const lower = obj.toLowerCase();
    for (const kw of UNFINISHED_KEYWORDS) {
      if (lower.includes(kw)) {
        results.push({ path, match: kw });
        break;
      }
    }
  } else if (Array.isArray(obj)) {
    obj.forEach((item, idx) => {
      results.push(...findUnfinishedStrings(item, `${path}[${idx}]`));
    });
  } else if (obj !== null && typeof obj === "object") {
    Object.entries(obj).forEach(([key, val]) => {
      results.push(...findUnfinishedStrings(val, path ? `${path}.${key}` : key));
    });
  }
  return results;
}

export const noUnfinishedFeaturesRule: ComplianceRule = {
  code: "ZMA-002",
  title: "Tính năng chưa hoàn thiện / Coming Soon",
  severity: "error",
  source: "Zalo Mini App Policy — lỗi #1: Chức năng đang phát triển",
  check(ctx) {
    const issues: ComplianceIssue[] = [];

    // Scan app meta
    const appMatches = findUnfinishedStrings(ctx.builder.app, "app");
    appMatches.forEach((m) => {
      issues.push({
        ruleCode: "ZMA-002",
        ruleTitle: this.title,
        severity: "error",
        message: `Phát hiện cụm từ chưa hoàn thiện ("${m.match}") trong thông tin ứng dụng (${m.path}).`,
        fix: "Xóa bỏ các cụm từ 'đang phát triển' / 'coming soon' hoặc thay bằng nội dung hoàn chỉnh trước khi nộp duyệt.",
        source: this.source,
        location: { fieldPath: m.path },
      });
    });

    // Scan pages & blocks
    ctx.builder.pages.forEach((page, pIdx) => {
      page.blocks.forEach((block, bIdx) => {
        const blockMatches = findUnfinishedStrings(
          block.props,
          `pages[${pIdx}].blocks[${bIdx}].props`
        );
        blockMatches.forEach((m) => {
          issues.push({
            ruleCode: "ZMA-002",
            ruleTitle: this.title,
            severity: "error",
            message: `Block "${block.type}" (trang "${page.title}") chứa từ khóa chưa hoàn thiện ("${m.match}").`,
            fix: "Cập nhật hoặc ẩn các khối chức năng chưa sẵn sàng trước khi gửi duyệt.",
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
