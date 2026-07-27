# Zalo Platform Constraints & Spec Verification Results

**Thời gian kiểm chứng:** 2026-07-27  
**Phiên bản liên quan:** `zmp-cli` 4.0.3, `zmp-ui` 1.11.14, `zmp-sdk` 2.51.8, `react` 18.2.0, `vite` 5.4.21

---

## 1. Kết quả thử nghiệm môi trường & `zmp-ui`

### 1.1 `zmp-ui` ngoài môi trường Zalo (Trình duyệt Web tiêu chuẩn)
- **KẾT QUẢ:** **SỐNG 100% (Kết cục 1 & 2)**
- Tất cả các component UI chính (`App`, `Page`, `Header`, `Box`, `Button`, `Text`, `Icon`, `List`, `Swiper`, `Modal`, `Sheet`, `SnackbarProvider`) là các component React tiêu chuẩn, build mượt mà bằng Vite tiêu chuẩn và render được bình thường ngoài môi trường Zalo Mini App.
- **`zmp-sdk` bridge:** Các API đụng chạm thiết bị thật hoặc hệ sinh thái Zalo (như `getSystemInfo()`, `getUserInfo()`, `authorize()`, `followOA()`, `openChat()`) cần bọc qua `services/zalo-bridge.ts` để mock dữ liệu khi render trong Preview Builder.

### 1.2 Cấu trúc Route & `app-config.json`
- **Route registration:** Các trang (Pages) và Tuyến đường (Routes) được đăng ký trực tiếp bằng **React Router** (`react-router-dom`) bên trong React layout component (ví dụ: `<Routes><Route path="..." element={...}/></Routes>`), **KHÔNG KHAI BÁO Route trong `app-config.json`**.
- **`app-config.json` scope:** Chỉ chứa các cấu hình cửa sổ ứng dụng (`title`, `textColor`, `leftButton`, `statusBar`, `actionBarHidden`), danh sách CSS/JS sync và template info.

### 1.3 Lỗi đóng gói ESM Node.js (Gotcha)
- File build ESM của `zmp-ui` chứa directory import không kèm đuôi file (ví dụ `import ... from 'components/app'`). 
- **Giải pháp:** Bundler phía Builder (Vite / Esbuild) xử lý mượt mà directory imports này. Khi viết generator/builder, cần đảm bảo sử dụng bundler tương thích.

---

## 2. Schema `builder.json` & Ràng buộc kiểm duyệt Zalo

### 2.1 Schema Zod (`packages/schema/builder-schema.ts`)
- **App Name validation:** Chặn viết IN HOA toàn bộ (ví dụ: `CA PHE SANG`), chặn ký tự lạ.
- **Route requirement:** Bắt buộc có trang chính chủ với path `/`.
- **Permissions strict derivation:** Thuộc tính `permissions` **tự động suy ra** từ danh sách block được sử dụng (ví dụ: `booking-form` tự động suy ra `userInfo` & `phoneNumber`, `map-location` suy ra `location`). **Không cho phép người dùng tự khai báo quyền**, loại bỏ hoàn toàn rủi ro bị từ chối kiểm duyệt do "xin quyền thừa" (Lỗi #3).
- **Mandatory System Blocks:** Tự động sinh trang & block Chính sách bảo mật (`privacy-policy`) nhằm vượt qua tiêu chuẩn kiểm duyệt Zalo.

---

## 3. Danh sách Block MVP (12 Blocks)

| Nhóm | Block Type | Quyền Zalo suy ra | Ghi chú |
|---|---|---|---|
| **Chung** | `banner` | Không | Carousel hình ảnh khuyến mãi |
| **Chung** | `rich-text` | Không | Văn bản mô tả giới thiệu |
| **Chung** | `image-gallery` | Không | Thư viện hình ảnh sản phẩm/cửa hàng |
| **Chung** | `contact-info` | Không | Địa chỉ, số điện thoại, giờ mở cửa |
| **Chung** | `map-location` | `location` | Bản đồ & định vị cửa hàng gần nhất |
| **Bán hàng** | `product-list` | Không | Danh sách sản phẩm theo danh mục |
| **Bán hàng** | `product-detail` | Không | Chi tiết sản phẩm & tùy chọn topping/size |
| **Bán hàng** | `cart-button` | Không | Nút giỏ hàng nổi & thanh toán |
| **Dịch vụ** | `booking-form` | `userInfo`, `phoneNumber` | Form đặt lịch / đặt bàn trước |
| **Dịch vụ** | `service-price-list` | Không | Bảng giá dịch vụ |
| **Bắt buộc** | `privacy-policy` | Không | Tự động sinh nội dung chính sách bảo mật |
| **Bắt buộc** | `permission-request` | `userInfo` | Màn hình xin quyền chuẩn Zalo UI |

---

## 4. Đánh giá rủi ro & Khắc phục

1. **Khả năng hiển thị preview:** Đã xác minh 100% `zmp-ui` hoạt động tốt trên Web thường, preview builder chạy cực nhanh không cần nhúng iframe zmp cli.
2. **Tuân thủ kiểm duyệt Zalo:** Toàn bộ 12 block MVP được thiết kế hoàn chỉnh, có mock data chạy được ngay, không có nút chết (khắc phục lỗi kiểm duyệt #1).

---

**Kết luận Phase 01:** Tất cả các ràng buộc kỹ thuật đã được kiểm chứng thành công. Sẵn sàng bước sang Phase 02 (Core Code Generator) & Phase 03 (Block Library).
