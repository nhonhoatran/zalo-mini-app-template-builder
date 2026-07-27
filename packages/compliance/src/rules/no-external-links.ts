import { ComplianceRule, ComplianceIssue } from "../rule-type";

const ALLOWED_DOMAIN_PATTERNS = [
  /(?:^|\.)zalo\.me$/i,
  /(?:^|\.)zalo\.app$/i,
  /(?:^|\.)zapps\.vn$/i,
  /(?:^|\.)zalo\.net$/i,
  /(?:^|\.)zalopay\.vn$/i,
  /(?:^|\.)zaloapp\.com$/i,
  /^localhost$/i,
  /^127\.0\.0\.1$/i,
];

function isExternalUrl(urlStr: string): boolean {
  try {
    const parsed = new URL(urlStr);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return false; // ignore blob:, data:, mailto:, tel:, etc.
    }
    const hostname = parsed.hostname;
    return !ALLOWED_DOMAIN_PATTERNS.some((pattern) => pattern.test(hostname));
  } catch {
    return false;
  }
}

function findExternalUrls(obj: unknown, path: string): { path: string; url: string }[] {
  const results: { path: string; url: string }[] = [];
  if (typeof obj === "string") {
    const urlMatches = obj.match(/https?:\/\/[^\s"'<>()]+/gi);
    if (urlMatches) {
      for (const rawUrl of urlMatches) {
        if (isExternalUrl(rawUrl)) {
          results.push({ path, url: rawUrl });
        }
      }
    }
  } else if (Array.isArray(obj)) {
    obj.forEach((item, idx) => {
      results.push(...findExternalUrls(item, `${path}[${idx}]`));
    });
  } else if (obj !== null && typeof obj === "object") {
    Object.entries(obj).forEach(([key, val]) => {
      results.push(...findExternalUrls(val, path ? `${path}.${key}` : key));
    });
  }
  return results;
}

export const noExternalLinksRule: ComplianceRule = {
  code: "ZMA-005",
  title: "Liên kết ngoài hệ sinh thái Zalo",
  severity: "error",
  source: "Zalo Mini App Policy — lỗi #4: Điều hướng ra ngoài Zalo",
  check(ctx) {
    const issues: ComplianceIssue[] = [];

    // Scan app meta
    const appUrls = findExternalUrls(ctx.builder.app, "app");
    appUrls.forEach((m) => {
      issues.push({
        ruleCode: "ZMA-005",
        ruleTitle: this.title,
        severity: "error",
        message: `Phát hiện đường dẫn (URL) trỏ ra ngoài hệ sinh thái Zalo: "${m.url}".`,
        fix: "Zalo không cho phép mở liên kết trang web bên ngoài. Hãy đổi sang liên kết thuộc domain Zalo (*.zalo.me, *.zapps.vn) hoặc liên kết nội bộ Mini App.",
        source: this.source,
        location: { fieldPath: m.path },
      });
    });

    // Scan pages & blocks
    ctx.builder.pages.forEach((page, pIdx) => {
      page.blocks.forEach((block, bIdx) => {
        const blockUrls = findExternalUrls(
          block.props,
          `pages[${pIdx}].blocks[${bIdx}].props`
        );
        blockUrls.forEach((m) => {
          issues.push({
            ruleCode: "ZMA-005",
            ruleTitle: this.title,
            severity: "error",
            message: `Block "${block.type}" (trang "${page.title}") chứa đường dẫn mở ngoài Zalo: "${m.url}".`,
            fix: "Sử dụng đường dẫn Zalo OA (zalo.me/...) hoặc hàm zmp-sdk điều hướng trong Mini App thay vì URL ngoài.",
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
