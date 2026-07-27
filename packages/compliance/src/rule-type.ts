import { BuilderConfig } from "@zalo-builder/schema";

export type SeverityLevel = "error" | "warning" | "info";

export interface IssueLocation {
  pageId?: string;
  blockId?: string;
  fieldPath?: string;
}

export interface ComplianceIssue {
  ruleCode: string;
  ruleTitle: string;
  severity: SeverityLevel;
  message: string;
  fix: string;
  source: string;
  location?: IssueLocation;
}

export interface ComplianceContext {
  builder: BuilderConfig;
  outputFiles?: Record<string, string>;
}

export interface ComplianceRule {
  code: string;
  title: string;
  severity: SeverityLevel;
  source: string;
  check: (ctx: ComplianceContext) => ComplianceIssue[];
}

export interface ComplianceReportSummary {
  totalIssues: number;
  errorsCount: number;
  warningsCount: number;
  infosCount: number;
  passed: boolean;
  issues: ComplianceIssue[];
  checkedAt: string;
}
