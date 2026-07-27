# Zalo Mini App Template Builder

**Zalo Mini App Template Builder** là công cụ trực quan giúp lập trình viên, agency và doanh nghiệp thiết kế, xem trước và sinh mã nguồn ứng dụng Zalo Mini App chuẩn **ZaUI UI Kit** và **Zalo Mini App SDK**.

Điểm khác biệt cốt lõi của công cụ là **bộ kiểm duyệt quy tắc tự động (Compliance Engine)** giúp chặn trước các lỗi phổ biến khiến ứng dụng bị Zalo từ chối khi nộp duyệt.

---

## 🔥 Tính Năng Nổi Bật

- 🎨 **Visual Builder UI:** Thiết kế xếp khối theo chiều dọc (Block-based layout), trực quan, không bao giờ vỡ giao diện trên thiết bị di động.
- 🧩 **Thư viện Block phong phú (12 khối MVP):**
  - *Chung & Hiển thị:* Băng rôn ảnh (`banner`), Văn bản định dạng (`rich-text`), Bộ sưu tập ảnh (`image-gallery`), Thông tin liên hệ (`contact-info`), Vị trí bản đồ (`map-location`).
  - *Bán hàng & Dịch vụ:* Danh sách sản phẩm (`product-list`), Chi tiết sản phẩm (`product-detail`), Nút giỏ hàng (`cart-button`), Đặt lịch hẹn (`booking-form`), Bảng giá dịch vụ (`service-price-list`).
  - *Bắt buộc & Pháp lý:* Điều khoản & Bảo mật (`privacy-policy`), Xin quyền người dùng (`permission-request`).
- 🛡️ **Kiểm duyệt tự động (Compliance Engine):** Tự kiểm tra các quy định duyệt app của Zalo (tên app, thương hiệu, OA ID, quyền truy cập location/phone, điều khoản riêng tư) trước khi xuất mã nguồn.
- 📦 **Đóng gói ZIP & Nhập lại (Re-import):** Xuất toàn bộ mã nguồn React/Vite/ZMP-SDK thành file `.zip` sẵn sàng chạy (`zmp start` & `zmp deploy`). Kèm theo file `builder.json` để nhập lại chỉnh sửa tiếp bất cứ lúc nào.
- 🚀 **Dự án mẫu sẵn có (Starter Templates):**
  1. Quán Cà Phê & F&B (`coffee-shop`)
  2. Spa & Salon Làm Đẹp (`spa-salon`)
  3. Cửa Hàng Bán Lẻ & Thời Trang (`retail-shop`)

---

## 🛠️ Công Nghệ Sử Dụng (Tech Stack)

| Thành phần | Công nghệ |
|---|---|
| **Khung ứng dụng (Core)** | Next.js 14 (App Router), React 18, TypeScript |
| **Giao diện & Style** | Tailwind CSS v3, Lucide React icons |
| **Quản lý state** | Zustand, Immer |
| **Kiểm tra dữ liệu** | Zod Schema Validation |
| **Đóng gói file** | JSZip, FileSaver |
| **Testing** | Vitest |
| **Cấu trúc Monorepo** | npm / pnpm workspaces |

---

## 📁 Cấu Trúc Dự Án (Monorepo)

```text
zalo-mini-app-template-builder/
├── apps/
│   └── builder/               # Ứng dụng Web Builder chính (Next.js)
├── packages/
│   ├── schema/                # Định nghĩa Zod Schema & types cho builder.json
│   ├── blocks/                # Thư viện 12 block UI & Manifests
│   ├── generator/             # Bộ lõi sinh mã nguồn React/ZMP SDK (VirtualFileTree)
│   └── compliance/            # Engine kiểm duyệt quy định Zalo Mini App
├── docs/                      # Tài liệu hướng dẫn bắt đầu & deploy
├── plans/                     # Hồ sơ kế hoạch từng Phase phát triển
└── README.md                  # Tài liệu giới thiệu dự án
```

---

## 🚀 Hướng Dẫn Chạy Dưới Local

### 1. Cài đặt các thư viện phụ thuộc

```bash
npm install
```

### 2. Khởi chạy máy chủ phát triển (Dev Server)

```bash
npm run dev --workspace=apps/builder
```

Trình duyệt sẽ tự động mở giao diện Builder tại: **`http://localhost:3000`**

### 3. Kiểm thử tự động (Unit Tests)

```bash
npm test
```

---

## 📌 Ghi Chú & Định Hướng Phát Triển

> **Lưu ý:**
> Dự án này đang trong giai đoạn thử nghiệm và bước đầu đi đúng hướng, tuy nhiên cần tiếp tục điều chỉnh và hoàn thiện rất nhiều về mặt tính năng, độ bao phủ quy tắc kiểm duyệt cũng như trải nghiệm người dùng trước khi thương mại hóa chính thức.
