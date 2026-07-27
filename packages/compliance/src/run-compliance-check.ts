import { BuilderConfig } from "@zalo-builder/schema";
import {
  ComplianceContext,
  ComplianceIssue,
  ComplianceReportSummary,
  ComplianceRule,
} from "./rule-type";
import { ALL_COMPLIANCE_RULES } from "./rules";

export interface RunComplianceOptions {
  rules?: ComplianceRule[];
  outputFiles?: Record<string, string>;
  ignoreRuleCodes?: string[];
}

export function runComplianceCheck(
  builder: BuilderConfig,
  options: RunComplianceOptions = {}
): ComplianceReportSummary {
  const activeRules = options.rules ?? ALL_COMPLIANCE_RULES;
  const ignoreCodes = new Set(options.ignoreRuleCodes ?? []);

  const ctx: ComplianceContext = {
    builder,
    outputFiles: options.outputFiles,
  };

  const issues: ComplianceIssue[] = [];

  for (const rule of activeRules) {
    if (ignoreCodes.has(rule.code)) continue;
    try {
      const ruleIssues = rule.check(ctx);
      issues.push(...ruleIssues);
    } catch (err) {
      issues.push({
        ruleCode: rule.code,
        ruleTitle: rule.title,
        severity: "error",
        message: `Lỗi khi thực thi luật kiểm tra ${rule.code}: ${
          err instanceof Error ? err.message : String(err)
        }`,
        fix: "Kiểm tra lại dữ liệu đầu vào của ứng dụng.",
        source: rule.source,
      });
    }
  }

  const errorsCount = issues.filter((i) => i.severity === "error").length;
  const warningsCount = issues.filter((i) => i.severity === "warning").length;
  const infosCount = issues.filter((i) => i.severity === "info").length;

  return {
    totalIssues: issues.length,
    errorsCount,
    warningsCount,
    infosCount,
    passed: errorsCount === 0,
    issues,
    checkedAt: new Date().toISOString(),
  };
}
