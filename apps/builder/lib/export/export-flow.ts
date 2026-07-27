import { generateProject, VirtualFileTree } from "@zalo-builder/generator";
import { runComplianceCheck, emitMarkdownReport, ComplianceReportSummary } from "@zalo-builder/compliance";
import { BuilderConfig } from "@zalo-builder/schema";
import { buildZip } from "./build-zip";
import { downloadZipBlob } from "./download-zip";

export interface ExportResult {
  success: boolean;
  blob?: Blob;
  filename: string;
  complianceReport: ComplianceReportSummary;
  fileCount: number;
}

export interface ExportOptions {
  downloadImmediately?: boolean;
}

/**
 * Executes full export flow:
 * 1. Runs Zalo compliance validation check
 * 2. Generates VirtualFileTree source code
 * 3. Appends COMPLIANCE-REPORT.md to output tree
 * 4. Compresses tree into JSZip Blob
 * 5. Optionally triggers browser download
 */
export async function runExportFlow(
  config: unknown,
  options: ExportOptions = {}
): Promise<ExportResult> {
  const { downloadImmediately = true } = options;

  // 1. Compliance Audit
  const complianceReport = runComplianceCheck(config as BuilderConfig);

  // 2. Generate Virtual File Tree
  const tree: VirtualFileTree = generateProject({ config });

  // 3. Emit COMPLIANCE-REPORT.md & add to tree
  const appName = (config as BuilderConfig)?.app?.name || "Zalo Mini App";
  const complianceMd = emitMarkdownReport(complianceReport, appName);
  
  // Merge COMPLIANCE-REPORT.md into file tree
  const finalTree: VirtualFileTree = [
    ...tree.filter((f) => f.path !== "COMPLIANCE-REPORT.md"),
    {
      path: "COMPLIANCE-REPORT.md",
      content: complianceMd,
    },
  ];

  // 4. Build ZIP Blob
  const blob = await buildZip(finalTree);

  // 5. Generate safe filename
  const safeSlug = appName
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  const filename = `zalo-mini-app-${safeSlug || "project"}.zip`;

  // 6. Download if requested
  if (downloadImmediately) {
    downloadZipBlob(blob, filename);
  }

  return {
    success: true,
    blob,
    filename,
    complianceReport,
    fileCount: finalTree.length,
  };
}
