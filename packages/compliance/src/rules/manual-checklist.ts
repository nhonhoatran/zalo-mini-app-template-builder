import { ComplianceRule, ComplianceIssue } from "../rule-type";

export const MANUAL_CHECKLIST_ITEMS = [
  {
    id: "legal_license",
    title: "Giấy phép kinh doanh / CCCD chủ thể",
    description: "Đã chuẩn bị bản quét/ảnh chụp GPKD doanh nghiệp hoặc CCCD cá nhân để nộp khi được Zalo yêu cầu.",
  },
  {
    id: "brand_authorization",
    title: "Giấy ủy quyền thương hiệu / Nhãn hiệu",
    description: "Nếu Mini App sử dụng tên/logo thương hiệu lớn, cần có giấy chứng nhận nhãn hiệu hoặc bản ủy quyền hợp lệ.",
  },
  {
    id: "oa_verification",
    title: "Xác thực Zalo Official Account (OA)",
    description: "Tài khoản OA liên kết phải được xác thực tích vàng và có tên khớp/liên quan đến Mini App.",
  },
  {
    id: "real_device_testing",
    title: "Kiểm thử trên thiết bị thật (iOS & Android)",
    description: "Đã quét mã QR bằng app Zalo thật trên cả 2 hệ điều hành iOS và Android để đảm bảo giao diện không vỡ.",
  },
];

export const manualChecklistRule: ComplianceRule = {
  code: "ZMA-009",
  title: "Danh mục kiểm tra thủ tục pháp lý & vận hành",
  severity: "info",
  source: "Zalo Mini App Policy — lỗi #7 & #9: Hồ sơ & Giấy tờ đăng ký",
  check() {
    const issues: ComplianceIssue[] = [];

    MANUAL_CHECKLIST_ITEMS.forEach((item) => {
      issues.push({
        ruleCode: "ZMA-009",
        ruleTitle: this.title,
        severity: "info",
        message: `[Cần tự xác nhận] ${item.title}: ${item.description}`,
        fix: "Tích chọn xác nhận danh mục này trong bảng kiểm duyệt trước khi nộp hồ sơ.",
        source: this.source,
        location: { fieldPath: `manualChecklist.${item.id}` },
      });
    });

    return issues;
  },
};
