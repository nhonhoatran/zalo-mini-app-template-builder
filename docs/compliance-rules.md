# Hướng Dẫn & Giải Thích Chi Tiết Bộ Luật Kiểm Duyệt Zalo Mini App

Tài liệu này tổng hợp toàn bộ 9 quy tắc kiểm duyệt (Compliance Rules) thuộc hệ thống **Zalo Mini App Template Builder Compliance Engine**. Mỗi quy tắc được xây dựng dựa trên Zalo Mini App Review Policy thực tế nhằm giúp các nhà phát triển và chủ cửa hàng duyệt ứng dụng thành công ngay trong lần nộp đầu tiên.

---

## 📋 Danh Sách Bộ Luật Kiểm Duyệt MVP

### 1. [ZMA-001] `no-placeholder-content` — Còn dữ liệu mẫu chưa thay đổi
- **Mức độ:** ❌ Bắt buộc sửa (Error)
- **Mô tả:** Kiểm tra và phát hiện các khối giao diện (Block) vẫn còn giữ lại hình ảnh mẫu, văn bản mặc định (như Unsplash sample, Picsum, hoặc sản phẩm mẫu).
- **Lý do Zalo từ chối:** Zalo coi ứng dụng chứa dữ liệu mẫu là ứng dụng chưa hoàn thiện hoặc spam.
- **Cách khắc phục:** Thay thế toàn bộ hình ảnh và dữ liệu mẫu bằng thông tin thật của thương hiệu/cửa hàng.

---

### 2. [ZMA-002] `no-unfinished-features` — Tính năng chưa hoàn thiện / Coming Soon
- **Mức độ:** ❌ Bắt buộc sửa (Error)
- **Mô tả:** Đã quét và phát hiện các cụm từ như "đang phát triển", "coming soon", "TODO", "chuẩn bị ra mắt", "đang cập nhật" trong giao diện hoặc văn bản ứng dụng.
- **Lý do Zalo từ chối:** Mọi tính năng hiển thị trên Zalo Mini App phải hoạt động trơn tru. Không được tạo nút bấm hoặc trang "chờ ra mắt".
- **Cách khắc phục:** Xóa bỏ hoặc ẩn hoàn toàn các khối tính năng chưa sẵn sàng trước khi gửi hồ sơ duyệt.

---

### 3. [ZMA-003] `privacy-policy-present` — Thiếu thông tin Chính sách bảo mật
- **Mức độ:** ❌ Bắt buộc sửa (Error)
- **Mô tả:** Kiểm tra sự tồn tại của khối hoặc trang Chính sách bảo mật (Privacy Policy).
- **Lý do Zalo từ chối:** Zalo yêu cầu tất cả Mini App công khai điều khoản thu thập & xử lý dữ liệu người dùng.
- **Cách khắc phục:** Kéo thả khối `privacy-policy` vào trang cài đặt hoặc tạo trang đường dẫn `/privacy-policy`.

---

### 4. [ZMA-004] `permissions-minimal` — Khai báo quyền không tối thiểu
- **Mức độ:** ❌ Bắt buộc sửa (Error)
- **Mô tả:** Đã so sánh danh sách quyền khai báo trong `app-config.json` với các khối chức năng thực tế đang dùng trong ứng dụng.
- **Lý do Zalo từ chối:** Lạm dụng quyền riêng tư (ví dụ: xin vị trí GPS hoặc số điện thoại nhưng không có tính năng nào cần dùng tới).
- **Cách khắc phục:** Hệ thống tự động loại bỏ các quyền rác, chỉ giữ lại các quyền thực sự được các khối yêu cầu.

---

### 5. [ZMA-005] `no-external-links` — Liên kết ngoài hệ sinh thái Zalo
- **Mức độ:** ❌ Bắt buộc sửa (Error)
- **Mô tả:** Phát hiện đường dẫn web (URL) trỏ ra ngoài các tên miền được Zalo cho phép (như `zalo.me`, `zapps.vn`, `zalopay.vn`).
- **Lý do Zalo từ chối:** Zalo không cho phép Mini App làm cầu nối mở trang web bên ngoài hệ sinh thái.
- **Cách khắc phục:** Đổi sang liên kết Zalo Official Account, liên kết nội bộ Mini App hoặc sử dụng JS SDK chuẩn.

---

### 6. [ZMA-006] `app-name-format` — Tên Mini App không hợp lệ
- **Mức độ:** ❌ Bắt buộc sửa (Error)
- **Mô tả:** Phát hiện tên ứng dụng viết IN HOA toàn bộ, quá ngắn (<2 ký tự) hoặc chứa các biểu tượng/ký tự đặc biệt không được phép.
- **Lý do Zalo từ chối:** Tên Mini App phải tuân thủ chuẩn tiếng Việt, viết hoa chữ cái đầu và không chứa ký tự quảng cáo/emoji rác.
- **Cách khắc phục:** Đổi tên sang dạng Viết Hoa Chữ Cái Đầu (ví dụ: "Tiệm Cà Phê Siêu Tốc").

---

### 7. [ZMA-007] `no-sensitive-payment` — Nghi vấn tính năng thanh toán nhạy cảm
- **Mức độ:** ⚠️ Cảnh báo rủi ro (Warning)
- **Mô tả:** Quét các từ khóa nhạy cảm liên quan tới "nạp tiền", "đổi điểm", "rút tiền", "đổi thẻ cào".
- **Lý do rủi ro:** Các ứng dụng ví ảo/nạp điểm đổi tiền mặt bị Zalo quản lý cực kỳ nghiêm ngặt theo pháp luật tài chính.
- **Cách khắc phục:** Đảm bảo luồng tích điểm chỉ dùng nội bộ, không đổi ra tiền mặt và tích hợp ZaloPay SDK chính thức.

---

### 8. [ZMA-008] `description-matches-blocks` — Mô tả ứng dụng không khớp với tính năng thực tế
- **Mức độ:** ⚠️ Cảnh báo rủi ro (Warning)
- **Mô tả:** Đối chiếu phần mô tả giới thiệu app với các khối giao diện thực tế. Nếu mô tả nhắc đến "đặt lịch" nhưng không có block `booking-form`, hệ thống sẽ cảnh báo.
- **Lý do rủi ro:** Chuyên viên duyệt Zalo sẽ từ chối nếu mô tả app một đằng nhưng giao diện làm một nẻo.
- **Cách khắc phục:** Bổ sung khối chức năng tương ứng hoặc sửa lại mô tả ngắn gọn đúng thực tế.

---

### 9. [ZMA-009] `manual-checklist` — Danh mục kiểm tra thủ tục pháp lý & vận hành
- **Mức độ:** ℹ️ Hồ sơ thủ tục (Info)
- **Mô tả:** Danh mục nhắc nhở nhà phát triển chuẩn bị sẵn các giấy tờ pháp lý (GPKD, Giấy ủy quyền thương hiệu, Xác thực OA tích vàng, Test thiết bị thật).
- **Cách khắc phục:** Tích chọn thủ công từng mục trong bảng kiểm duyệt trước khi nộp hồ sơ lên Zalo Developer Dashboard.
