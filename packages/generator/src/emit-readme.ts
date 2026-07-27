import { BuilderConfig } from "@zalo-builder/schema";
import { VirtualFile } from "./virtual-file-tree";

export function emitReadme(builderConfig: BuilderConfig): VirtualFile {
  const { app, permissions } = builderConfig;
  const permList = permissions && permissions.length > 0
    ? permissions.map((p) => `- \`${p}\``).join("\n")
    : "- Không xin quyền riêng tư nào bổ sung";

  const content = `# ${app.name}

> Dự án Zalo Mini App được sinh tự động từ Zalo Mini App Template Builder.

## 🚀 Hướng dẫn chạy & phát triển (Quick Start)

### 1. Cài đặt phụ thuộc
\`\`\`bash
npm install
\`\`\`

### 2. Chạy thử nghiệm trên máy local (Development)
\`\`\`bash
npm run dev
# Hoặc: npx zmp start
\`\`\`

### 3. Đăng nhập Zalo Mini App CLI
\`\`\`bash
npx zmp login
\`\`\`

### 4. Đóng gói & Nộp duyệt (Deploy)
\`\`\`bash
npm run build
# Hoặc: npx zmp deploy
\`\`\`

---

## 🔒 Danh sách quyền Zalo Mini App (Derived Permissions)

Dựa trên các khối chức năng (blocks) được chọn, ứng dụng xin các quyền sau:
${permList}

---

## ✅ Checklist kiểm duyệt Zalo Mini App trước khi nộp duyệt (App Review Checklist)

- [x] Trang **Chính sách bảo mật** (\`/privacy\`) đã được tự động khởi tạo.
- [ ] Tên ứng dụng không viết IN HOA toàn bộ, không chứa từ ngữ thương hiệu không sở hữu.
- [ ] Không có tính năng hoặc nút bấm giả ("nút chết").
- [ ] Ứng dụng đã được liên kết với Official Account (OA) hợp lệ (nếu cần).
- [ ] Đã kiểm tra giao diện trên cả iOS và Android thông qua Zalo Developer App.

---
*Sinh lúc: ${builderConfig.generated?.at || new Date().toISOString()} bởi Zalo Mini App Builder v${builderConfig.generated?.builderVersion || "1.0.0"}*
`;

  return {
    path: "README.md",
    content,
  };
}
