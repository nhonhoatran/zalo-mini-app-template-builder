import { ComplianceReportSummary } from "../rule-type";

export function emitMarkdownReport(report: ComplianceReportSummary, appName?: string): string {
  const statusEmoji = report.passed ? "✅ ĐẠT YÊU CẦU" : "❌ CHƯA ĐẠT";
  const name = appName || "Zalo Mini App";

  let md = `# Báo Cáo Kiểm Duyệt Zalo Mini App: ${name}\n\n`;
  md += `**Trạng thái kiểm duyệt:** ${statusEmoji}\n`;
  md += `**Thời gian kiểm tra:** ${new Date(report.checkedAt).toLocaleString("vi-VN")}\n\n`;

  md += `## 📊 Tóm Tắt Kết Quả\n\n`;
  md += `| Mức độ | Số lượng | Trạng thái |\n`;
  md += `|---|---|---|\n`;
  md += `| ❌ Lỗi bắt buộc sửa (Error) | ${report.errorsCount} | ${report.errorsCount === 0 ? "✅ Sạch lỗi" : "❌ Cần xử lý gấp"} |\n`;
  md += `| ⚠️ Cảnh báo rủi ro (Warning) | ${report.warningsCount} | ${report.warningsCount === 0 ? "✅ Không có" : "⚠️ Cần rà soát"} |\n`;
  md += `| ℹ️ Danh mục thủ tục (Info) | ${report.infosCount} | ℹ️ Kiểm tra tích tay |\n`;
  md += `| **Tổng số phát hiện** | **${report.totalIssues}** | |\n\n`;

  const errors = report.issues.filter((i) => i.severity === "error");
  const warnings = report.issues.filter((i) => i.severity === "warning");
  const infos = report.issues.filter((i) => i.severity === "info");

  if (errors.length > 0) {
    md += `## ❌ Danh Sách Lỗi Bắt Buộc Sửa (${errors.length})\n\n`;
    md += `> Các lỗi này chắc chắn sẽ khiến Zalo từ chối duyệt ứng dụng.\n\n`;
    errors.forEach((issue, idx) => {
      md += `### ${idx + 1}. [${issue.ruleCode}] ${issue.ruleTitle}\n`;
      md += `- **Mô tả:** ${issue.message}\n`;
      md += `- **Cách khắc phục:** ${issue.fix}\n`;
      if (issue.location?.fieldPath) {
        md += `- **Vị trí:** \`${issue.location.fieldPath}\`\n`;
      }
      md += `- **Căn cứ:** ${issue.source}\n\n`;
    });
  }

  if (warnings.length > 0) {
    md += `## ⚠️ Cảnh Báo Rủi Ro Duyệt (${warnings.length})\n\n`;
    md += `> Có rủi ro bị từ chối tùy theo đánh giá của chuyên viên duyệt Zalo.\n\n`;
    warnings.forEach((issue, idx) => {
      md += `### ${idx + 1}. [${issue.ruleCode}] ${issue.ruleTitle}\n`;
      md += `- **Mô tả:** ${issue.message}\n`;
      md += `- **Cách khắc phục:** ${issue.fix}\n`;
      if (issue.location?.fieldPath) {
        md += `- **Vị trí:** \`${issue.location.fieldPath}\`\n`;
      }
      md += `- **Căn cứ:** ${issue.source}\n\n`;
    });
  }

  if (infos.length > 0) {
    md += `## ℹ️ Danh Mục Thủ Tục Pháp Lý & Vận Hành (${infos.length})\n\n`;
    md += `> Builder không tự kiểm tra được các mục này, anh/chị vui lòng tích tay xác nhận.\n\n`;
    infos.forEach((issue, idx) => {
      md += `- [ ] **[${issue.ruleCode}]** ${issue.message}\n`;
      md += `  - *Gợi ý:* ${issue.fix}\n`;
    });
    md += `\n`;
  }

  md += `---\n*Báo cáo được khởi tạo tự động bởi Zalo Mini App Template Builder Compliance Engine.*\n`;

  return md;
}
