# Zalo Mini App — Ràng buộc nền tảng (research)

Ngày: 2026-07-27. Dùng làm căn cứ cho toàn bộ plan.

## Mức độ tin cậy

| Ký hiệu | Nghĩa |
|---|---|
| ✅ | Đã xác minh từ nguồn chính chủ (GitHub Zalo-MiniApp, npm) |
| 🟡 | Nguồn bên thứ ba (blog agency VN), hợp lý nhưng cần đối chiếu doc chính chủ |
| ❓ | Chưa xác minh — phải tự kiểm ở phase-01 |

## 1. Stack kỹ thuật của một Zalo Mini App

✅ Xác minh qua template chính chủ [Zalo-MiniApp/zaui-coffee](https://github.com/Zalo-MiniApp/zaui-coffee):

- React + TypeScript
- Vite (`vite.config.mts`) + [`zmp-vite-plugin`](https://github.com/Zalo-MiniApp/zmp-vite-plugin)
- [`zmp-ui`](https://www.npmjs.com/package/zmp-ui) — thư viện component ZaUI
- [`zmp-sdk`](https://www.npmjs.com/package/zmp-sdk) — API nền tảng (quyền, thanh toán, OA...)
- Recoil (state), Tailwind CSS + PostCSS + SCSS
- CLI: [`zmp-cli`](https://www.npmjs.com/package/zmp-cli) — `zmp start` / `zmp login` / `zmp deploy`

Cấu trúc thư mục chuẩn:

```
src/
  components/   # component tái dùng
  pages/        # mỗi page là 1 view, đăng ký làm Route
  css/
  services/     # gọi API, lấy access token, cache
  types/
  statics/      # icon, ảnh
  state.ts      # Recoil atoms/selectors
  app.ts        # entry
mock/
app-config.json # config toàn cục: primaryColor, searchBar, oaIDtoOpenChat...
.env.development / .env.production
```

❓ **Mâu thuẫn giữa hai nguồn cần tự kiểm:** một nguồn nói page đăng ký Route trong `app.tsx`, nguồn khác nói đăng ký trong `app-config.json`. Phải dựng project thật ở phase-01 rồi coi.

Template chính chủ khác để tham chiếu: `zaui-shop` (e-commerce), `zaui-restaurant`, `zmp-blank-templates`.

## 2. Quy trình kiểm duyệt

🟡 Nguồn: [miniapp.vn](https://miniapp.vn/quy-trinh-kiem-duyet-zalo-mini-app/), [digibird.co](https://digibird.co/cach-tao-zalo-mini-app-dap-ung-chinh-sach-kiem-duyet-zalo-mini-app/)

- Thời gian duyệt: **3–7 ngày làm việc** (thường 3–5; app sạch có thể còn 1–2 ngày)
- Cao điểm (lễ, Tết, mùa tuyển sinh) kéo dài hơn
- Bị từ chối → hệ thống trả về lý do cụ thể, sửa rồi nộp lại
- Version đã duyệt thì publish được ngay

→ **Hệ quả với sản phẩm:** builder KHÔNG ôm khâu deploy/duyệt. Người dùng (dev/agency) tự làm. Sản phẩm chỉ lo phần "sinh ra code đúng chuẩn để duyệt 1 lần là qua".

## 3. Checklist lỗi bị từ chối — đây là lõi giá trị sản phẩm

🟡 Nguồn: [pandaloyalty.com](https://pandaloyalty.com/loi-pho-bien-khien-zalo-mini-app-bi-tu-choi/) + tổng hợp

Cột cuối là điều quan trọng nhất: builder tự chặn được lỗi nào.

| # | Lỗi | Builder chặn được? |
|---|---|---|
| 1 | Chức năng chưa hoàn thiện: nút không phản hồi, nội dung trống, dữ liệu demo, còn mục "đang phát triển" | ✅ **Tự động** — chỉ sinh block đã hoàn chỉnh; validator quét nội dung mẫu chưa thay |
| 2 | Chức năng nhạy cảm: nạp tiền vào ví trong app, đổi điểm ra tiền mặt | 🟡 **Cảnh báo** — không cho tạo block ví/nạp tiền, gợi ý ZaloPay hoặc voucher |
| 3 | Quyền riêng tư: xin quyền thừa, thiếu chính sách bảo mật, thu thập không xin phép | ✅ **Tự động** — sinh sẵn trang chính sách + màn hình xin quyền đúng chuẩn; chỉ khai quyền mà block đang dùng thật |
| 4 | Điều hướng ra ngoài: link web ngoài, link mạng xã hội | ✅ **Tự động** — validator quét mọi URL trong config |
| 5 | Nội dung không khớp mô tả đăng ký với Zalo | 🟡 **Nhắc** — sinh sẵn bản nháp mô tả khớp với block đã chọn |
| 6 | Tên app không hợp lệ: IN HOA TOÀN BỘ, ký tự đặc biệt, trùng thương hiệu | ✅ **Tự động** — validate ô nhập tên |
| 7 | Thiếu giấy tờ: GPKD, giấy ủy quyền thương hiệu, tên OA không khớp | ❌ **Ngoài tầm** — chỉ hiện checklist nhắc việc |
| 8 | Vỡ layout, không responsive, font khó đọc, load chậm | ✅ **Tự động theo thiết kế** — layout xếp khối dọc không cho đặt tọa độ tự do nên không vỡ được |

**Đọc bảng này ra chiến lược bán hàng:** 5/8 lỗi builder chặn tự động, 2/8 cảnh báo, 1/8 ngoài tầm. Nói thẳng con số này trên landing page — đừng hứa "duyệt là đậu 100%".

## 4. Câu hỏi còn treo

1. `zmp-ui` có render được trên trình duyệt web thường (ngoài môi trường Zalo) không? — quyết định việc preview trong builder có dùng chung component thật được không. **Rủi ro cao nhất của cả dự án**, phải kiểm đầu tiên.
2. Page đăng ký Route ở `app.tsx` hay `app-config.json`?
3. Zalo có ràng buộc gì về dung lượng bundle / số page tối đa không?
4. Danh sách quyền (permission) đầy đủ mà `zmp-sdk` hỗ trợ, và quyền nào cần giải trình khi duyệt?
5. Có văn bản chính sách kiểm duyệt chính chủ (không phải blog agency) để đối chiếu bảng mục 3 không?
