import { ComplianceRule, ComplianceIssue } from "../rule-type";
import { derivePermissions } from "@zalo-builder/schema";

export const permissionsMinimalRule: ComplianceRule = {
  code: "ZMA-004",
  title: "Khai báo quyền không tối thiểu",
  severity: "error",
  source: "Zalo Mini App Policy — lỗi #3: Lạm dụng quyền truy cập",
  check(ctx) {
    const issues: ComplianceIssue[] = [];

    const declaredPermissions = ctx.builder.permissions || [];
    const neededPermissions = derivePermissions(ctx.builder.pages);

    const unusedPermissions = declaredPermissions.filter(
      (p) => !neededPermissions.includes(p)
    );

    if (unusedPermissions.length > 0) {
      issues.push({
        ruleCode: "ZMA-004",
        ruleTitle: this.title,
        severity: "error",
        message: `Ứng dụng khai báo các quyền [${unusedPermissions.join(
          ", "
        )}] nhưng không có khối tính năng (block) nào sử dụng tới.`,
        fix: `Loại bỏ các quyền không dùng [${unusedPermissions.join(
          ", "
        )}] khỏi danh sách xin cấp quyền để tuân thủ chính sách tối thiểu hóa quyền riêng tư của Zalo.`,
        source: this.source,
        location: { fieldPath: "permissions" },
      });
    }

    return issues;
  },
};
