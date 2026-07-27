# Hướng Dẫn Bắt Đầu & Triển Khai Zalo Mini App

Chào mừng anh/chị đến với ứng dụng Zalo Mini App được sinh tự động từ **Zalo Mini App Template Builder**.

Tài liệu này sẽ hướng dẫn chi tiết từ khâu chạy thử mã nguồn local, kiểm duyệt pháp lý, cho đến khi đưa ứng dụng lên hệ thống Zalo Official và vận hành lâu dài.

---

## 🚀 1. Cấu Trúc Mã Nguồn Trong File `.zip`

Sau khi giải nén file `.zip` vừa tải về, anh/chị sẽ thấy cấu trúc như sau:

```text
ten-app-cua-ban/
├── src/                        # Toàn bộ mã nguồn React & Zalo UI SDK
│   ├── app.tsx                 # Entrypoint ứng dụng
│   ├── pages/                  # Các trang đã thiết kế trong Builder
│   ├── components/             # Các block UI (banner, product, booking...)
│   └── zalo-bridge/            # Thư viện gọi Zalo SDK (OA, User Profile...)
├── statics/                    # Tài nguyên tĩnh (logo, icon...)
├── app-config.json             # Cấu hình Zalo Mini App (tên, màu sắc, router)
├── package.json                # Danh sách thư viện phụ thuộc
├── builder.json                # ⚠️ File cấu hình gốc để nhập lại sửa tiếp
├── COMPLIANCE-REPORT.md        # Báo cáo kết quả tự động kiểm duyệt Zalo
└── README.md                   # Hướng dẫn nhanh cho dự án
```

---

## 🛠️ 2. Chạy Thử Ứng Dụng (Local Development)

### Bước 2.1: Cài đặt Zalo Mini App CLI (`zmp-cli`)

Nút công cụ CLI của Zalo giúp anh/chị xem trước app trên máy tính và điện thoại.

```bash
npm install -g zmp-cli
```

### Bước 2.2: Cài đặt thư viện & khởi chạy

Mở Terminal / Command Prompt tại thư mục dự án và chạy:

```bash
# 1. Cài đặt toàn bộ dependencies
npm install

# 2. Khởi chạy máy chủ phát triển
zmp start
```

Sau khi chạy `zmp start`, trình duyệt sẽ tự động mở trang xem trước Zalo Mini App Simulator (hoặc truy cập `http://localhost:3000`).

---

## 📤 3. Triển Khai Lên Zalo Mini App Studio (Production Deploy)

Để đưa ứng dụng lên hệ thống Zalo cho khách hàng sử dụng, hãy làm theo các bước sau:

### Bước 3.1: Đăng nhập tài khoản Zalo Developer

```bash
zmp login
```

CLI sẽ hiển thị mã QR Code trên terminal. Dùng ứng dụng Zalo trên điện thoại quét mã QR để xác thực đăng nhập.

### Bước 3.2: Đóng gói và tải lên Zalo Cloud

```bash
zmp deploy
```

Hệ thống sẽ thực hiện:
1. Build mã nguồn tối ưu (Webpack / Vite).
2. Tải bản build lên **Zalo Mini App Developer Console** (`https://mini.zalo.me`).

---

## 📋 4. Checklist Tự Kiểm Trước Khi Nộp Duyệt Zalo

Trước khi bấm nút **"Gửi duyệt"** trên Zalo Developer Console, anh/chị cần đảm bảo hoàn tất các mục sau để tránh bị Zalo từ chối:

- [ ] **Thay thế nội dung mẫu:** Đã thay toàn bộ ảnh mẫu (Unsplash) và văn bản mặc định bằng thông tin doanh nghiệp thật.
- [ ] **Khớp thông tin app:** Tên ứng dụng trong `app-config.json` khớp 100% với tên app đăng ký trên `mini.zalo.me`.
- [ ] **Liên kết Zalo Official Account (OA):** Nếu app sử dụng tính năng theo dõi OA hoặc gửi thông báo ZNS, ID của Zalo OA phải khớp với tài khoản Doanh nghiệp đã xác thực.
- [ ] **Giấy phép kinh doanh (GPKD):**
  - Đã có GPKD / Giấy chứng nhận đăng ký doanh nghiệp.
  - Tên doanh nghiệp trên GPKD phải khớp với tên chủ sở hữu Zalo OA.
  - Đối với các ngành nghề kinh doanh có điều kiện (Y tế, Spa, Tài chính, Thực phẩm...): Đã chuẩn bị sẵn Giấy vệ sinh an toàn thực phẩm / Giấy phép hoạt động ngành nghề.
- [ ] **Giấy ủy quyền thương hiệu:** Nếu phân phối sản phẩm của thương hiệu khác, phải có Giấy ủy quyền từ hãng.
- [ ] **Trang Chính sách quyền riêng tư (Privacy Policy):** Đã kiểm tra liên kết điều khoản và chính sách bảo mật thông tin người dùng trong ứng dụng.

---

## 🔄 5. Hướng Dẫn Sửa Lại Ứng Dụng (Re-import `builder.json`)

Một ưu điểm lớn của Zalo Mini App Template Builder là **khả năng nhập lại file cấu hình để chỉnh sửa bất kỳ lúc nào**.

### Các bước sửa lại app:

1. Tìm file `builder.json` nằm ở thư mục gốc của dự án này (hoặc trong file `.zip` ban đầu).
2. Truy cập công cụ **Zalo Mini App Template Builder** trên trình duyệt.
3. Bấm nút **"Nhập JSON"** (hoặc kéo thả file `builder.json` vào).
4. Builder sẽ lập tức dựng lại đúng giao diện, các trang, danh mục sản phẩm và màu sắc của anh/chị.
5. Thực hiện thay đổi (thêm trang, đổi giá sản phẩm, thêm block mới...) và bấm **"Xuất File ZIP"** để tải bộ mã nguồn mới về.

> ⚠️ **LƯU Ý QUAN TRỌNG:**
> Khi anh/chị xuất file ZIP mới và giải nén đè lên dự án cũ, toàn bộ mã nguồn trong thư mục `src/` sẽ được cập nhật lại theo thiết kế mới nhất trên Builder. Nếu anh/chị từng tự viết thêm code React tùy biến vào `src/`, hãy lưu bản backup code tay trước khi ghi đè!

---

## 💬 6. Hỗ Trợ & Giải Đáp Thắc Mắc

Nếu gặp trục trặc trong quá trình triển khai hoặc nộp duyệt Zalo:
- **Tài liệu Zalo Mini App SDK chính thức:** [https://mini.zalo.me/docs/](https://mini.zalo.me/docs/)
- **Cộng đồng Zalo Mini App Developers:** Xem trên Zalo OA hoặc Zalo Community.
