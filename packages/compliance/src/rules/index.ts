import { ComplianceRule } from "../rule-type";
import { noPlaceholderContentRule } from "./no-placeholder-content";
import { noUnfinishedFeaturesRule } from "./no-unfinished-features";
import { privacyPolicyPresentRule } from "./privacy-policy-present";
import { permissionsMinimalRule } from "./permissions-minimal";
import { noExternalLinksRule } from "./no-external-links";
import { appNameFormatRule } from "./app-name-format";
import { noSensitivePaymentRule } from "./no-sensitive-payment";
import { descriptionMatchesBlocksRule } from "./description-matches-blocks";
import { manualChecklistRule } from "./manual-checklist";

export * from "./no-placeholder-content";
export * from "./no-unfinished-features";
export * from "./privacy-policy-present";
export * from "./permissions-minimal";
export * from "./no-external-links";
export * from "./app-name-format";
export * from "./no-sensitive-payment";
export * from "./description-matches-blocks";
export * from "./manual-checklist";

export const ALL_COMPLIANCE_RULES: ComplianceRule[] = [
  noPlaceholderContentRule,  // ZMA-001
  noUnfinishedFeaturesRule,  // ZMA-002
  privacyPolicyPresentRule,  // ZMA-003
  permissionsMinimalRule,    // ZMA-004
  noExternalLinksRule,       // ZMA-005
  appNameFormatRule,         // ZMA-006
  noSensitivePaymentRule,    // ZMA-007
  descriptionMatchesBlocksRule, // ZMA-008
  manualChecklistRule,       // ZMA-009
];
