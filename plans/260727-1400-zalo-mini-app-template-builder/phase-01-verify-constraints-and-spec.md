# Phase 01 — Kiểm chứng ràng buộc + chốt đặc tả

**Ưu tiên:** Cao nhất | **Trạng thái:** ⬜ Chưa làm | **Ước lượng:** 3–4 ngày

Liên kết: [plan.md](plan.md) · [research/zalo-platform-findings.md](research/zalo-platform-findings.md)

## Tổng quan

Chưa viết dòng code sản phẩm nào. Mục tiêu duy nhất: trả lời 5 câu hỏi treo ở research mục 4, và chốt schema `builder.json`. Sai schema ở đây là phải đập đi làm lại phase 02–04.

## Nhận định then chốt

Cả kiến trúc đang cược vào một giả định: **một file `component.tsx` dùng được ở cả hai nơi** — render trong preview builder (trình duyệt web thường) và copy nguyên si vô project output (môi trường Zalo). Nếu `zmp-ui` chết ngoài môi trường Zalo thì giả định sập, phải đổi hướng ngay chứ đừng để tới phase 04 mới biết.

## Việc phải làm

### 1. Dựng project Zalo Mini App thật (ngày 1)

```bash
npm i -g zmp-cli
zmp init          # chọn template React
npm i && zmp start
```

Ghi lại: cấu trúc thư mục thật, `app-config.json` có field gì, page đăng ký Route ở đâu (`app.tsx` hay `app-config.json` — hai nguồn nói khác nhau), version `zmp-ui` / `zmp-sdk` / `zmp-cli`.

Đối chiếu thêm với template chính chủ: `zaui-coffee`, `zaui-shop`, `zaui-restaurant`.

### 2. Thử `zmp-ui` trên web thường (ngày 1 — làm ngay, đừng để trễ)

Dựng 1 trang Next.js trống, `npm i zmp-ui`, import `Button`, `List`, `Box`, `Swiper` rồi render. Ghi nhận cái nào sống, cái nào chết, chết vì lý do gì.

Ba kết cục và cách xử:

| Kết cục | Hướng xử |
|---|---|
| Sống hết | Đi tiếp như plan. Ngon nhất |
| Sống, nhưng `zmp-sdk` chết | Bọc mọi lời gọi `zmp-sdk` qua `services/zalo-bridge.ts`, preview dùng bản mock. Vẫn đi tiếp được |
| `zmp-ui` chết luôn | **Đổi hướng:** preview render bằng iframe nhúng `zmp start` đang chạy, hoặc chấp nhận preview vẽ lại bằng HTML/CSS mô phỏng (chấp nhận rủi ro lệch). Cập nhật lại plan trước khi làm tiếp |

### 3. Chốt schema `builder.json` (ngày 2)

Bản nháp khởi điểm:

```jsonc
{
  "version": 1,
  "app": {
    "name": "Cà Phê Sáng",          // validate: không IN HOA hết, không ký tự lạ
    "description": "...",            // dùng để sinh bản nháp mô tả nộp Zalo
    "primaryColor": "#c0392b",
    "oaId": "",
    "locale": "vi"
  },
  "pages": [
    {
      "id": "home",
      "title": "Trang chủ",
      "path": "/",
      "showInTabBar": true,
      "icon": "zi-home",
      "blocks": [
        { "id": "b1", "type": "banner", "props": { "images": ["..."], "autoplay": true } },
        { "id": "b2", "type": "product-list", "props": { "title": "Thực đơn", "source": "mock" } }
      ]
    }
  ],
  "permissions": ["userInfo"],       // SINH RA từ block đang dùng, không cho khai tay
  "generated": { "at": "", "builderVersion": "" }
}
```

Ràng buộc cố ý đặt ra:
- `permissions` **không cho người dùng tự khai** — suy ra từ block đang dùng. Đây là cách chặn lỗi kiểm duyệt #3 (xin quyền thừa)
- Trang chính sách bảo mật **luôn được sinh**, không có nút tắt → chặn lỗi #3
- `props` của mỗi block phải khớp `propsSchema` trong manifest của block đó

### 4. Chốt danh sách block MVP (ngày 3)

Nguyên tắc: block nào cũng phải **hoàn chỉnh, chạy được, không có nút chết** — vì lỗi kiểm duyệt #1 là "chức năng chưa hoàn thiện".

Đề xuất 10 block cho MVP (chốt lại khi làm):

| Nhóm | Block |
|---|---|
| Chung | banner (carousel), rich-text, image-gallery, contact-info, map-location |
| Bán hàng | product-list, product-detail, cart-button |
| Dịch vụ | booking-form, service-price-list |
| Bắt buộc (tự sinh) | privacy-policy, permission-request |

### 5. Dựng repo + CI (ngày 4)

Monorepo hay đơn repo tuỳ, nhưng CI phải có ngay từ đầu: lint + typecheck + test. CV anh đang ghi "CI/CD basics" — dự án này là chỗ sửa chữ đó thành đồ thật.

⚠️ Repo mới → theo luật cứng: **dừng lại hỏi anh yêu muốn đẩy lên account GitHub nào** (midomax-hoa hay nhonhoatran), email commit, tên repo — chờ trả lời rồi mới `git init`.

## File tạo ra

- `packages/schema/builder-schema.ts` — kiểu TypeScript + validate bằng Zod
- `packages/schema/builder-schema.test.ts`
- `docs/zalo-platform-constraints.md` — kết quả kiểm chứng, cập nhật ngược vô research
- `.github/workflows/ci.yml`

## Todo

- [x] Cài `zmp-cli`, dựng project mẫu, kiểm chứng cấu trúc
- [x] Ghi lại cấu trúc thật + chốt câu hỏi Route ở đâu (`react-router-dom`, không ở `app-config.json`)
- [x] **Thử `zmp-ui` trên web thường** → Chốt Kết cục 1 & 2 (sống 100% trên Web thường với Vite)
- [x] Đọc `zaui-coffee`, liệt kê component ZaUI hay dùng
- [x] Viết schema `builder.json` bằng Zod + test (`packages/schema/builder-schema.ts`, 7/7 test pass)
- [x] Chốt danh sách 12 block MVP
- [x] Tạo tài liệu kiểm chứng (`docs/zalo-platform-constraints.md`) & CI (`.github/workflows/ci.yml`)
- [ ] Hỏi anh yêu về account GitHub → `git init` → push remote repo

## Tiêu chí hoàn thành

- `zmp start` chạy được project mẫu trên máy
- Đã biết chắc `zmp-ui` sống hay chết ngoài môi trường Zalo, và đã chọn hướng đi tương ứng
- Schema Zod parse được file `builder.json` mẫu, từ chối đúng các file sai
- Danh sách block MVP đã chốt, mỗi block ghi rõ cần quyền gì

## Rủi ro

| Rủi ro | Mức | Cách giảm |
|---|---|---|
| `zmp-ui` không chạy ngoài Zalo | **Cao** | Kiểm ngay ngày 1, có sẵn 3 hướng xử ở trên |
| Schema chốt sai, phase sau phải sửa | Trung bình | Để `version` trong schema ngay từ đầu, viết sẵn chỗ cho migration |
| Checklist kiểm duyệt lấy từ blog agency, không phải doc chính chủ | Trung bình | Tìm doc chính chủ; nếu không có thì ghi rõ trên landing là "dựa trên kinh nghiệm cộng đồng" |
| Cần Zalo App ID + OA để test `zmp deploy` | Thấp | Đăng ký sớm, khâu này chờ được |

## Bảo mật

- Access token Zalo tuyệt đối không commit — vô `.env`, `.gitignore` phải chặn `.env*` trừ `.env.example`
- Builder chạy client-side nên không giữ secret của người dùng; nếu sau này có backend thì phải xem lại

## Bước kế tiếp

Xong phase này thì phase 02 và 03 chạy song song được.
