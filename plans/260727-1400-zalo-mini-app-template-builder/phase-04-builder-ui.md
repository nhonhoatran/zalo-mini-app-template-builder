# Phase 04 — Giao diện builder

**Ưu tiên:** Cao | **Trạng thái:** ⬜ Chưa làm | **Ước lượng:** 4–5 ngày

Liên kết: [plan.md](plan.md) · [phase-02](phase-02-code-generator-core.md) · [phase-03](phase-03-block-library.md)

## Tổng quan

Giao diện kéo thả ba cột: chọn block bên trái, xem trước ở giữa, chỉnh thuộc tính bên phải. Chỉ xếp khối theo hàng dọc — không có canvas tọa độ tự do.

## Nhận định then chốt

Preview **không phải bản mô phỏng** mà là chính component thật của phase-03 render trong khung điện thoại. Sửa props bên phải → state đổi → component vẽ lại. Cùng thứ đó lát nữa được copy vô project sinh ra.

Và form chỉnh sửa bên phải **sinh tự động từ `propsSchema`** của block, không viết tay từng form. Thêm block mới ở phase-03 là form tự có, khỏi đụng vô phase-04. Đây là chỗ ăn tiền của việc chọn Zod làm nguồn sự thật duy nhất.

## Yêu cầu

**Chức năng**
- Thư viện block bên trái, gom nhóm, tìm kiếm được
- Kéo từ trái vào giữa để thêm; kéo trong cột giữa để đổi thứ tự; xoá block
- Chọn block → form thuộc tính hiện bên phải, sinh từ schema
- Đổi cài đặt app: tên, mô tả, màu chủ đạo, OA ID
- Quản lý nhiều trang, đặt trang nào lên thanh tab
- Tự lưu vô localStorage, mở lại không mất việc
- Hoàn tác / làm lại (undo/redo)
- Preview trong khung điện thoại, xem được cả nền sáng lẫn nền tối

**Phi chức năng**
- Kéo thả mượt, không giật khi có 20+ block
- Chạy 100% client-side, không cần backend
- Mỗi file component dưới 200 dòng

## Kiến trúc

```
apps/builder/                       # Next.js
├── app/
│   ├── page.tsx                    # trang builder
│   └── layout.tsx
├── components/
│   ├── block-palette/              # cột trái
│   │   ├── block-palette.tsx
│   │   └── block-palette-item.tsx
│   ├── canvas/                     # cột giữa
│   │   ├── phone-frame.tsx         # khung điện thoại
│   │   ├── block-canvas.tsx        # danh sách sắp xếp được
│   │   └── sortable-block.tsx
│   ├── inspector/                  # cột phải
│   │   ├── inspector-panel.tsx
│   │   ├── schema-form.tsx         # ← sinh form từ Zod schema
│   │   └── fields/                 # text, số, màu, ảnh, chọn, bật/tắt
│   ├── page-manager/               # quản lý trang
│   └── app-settings-form.tsx
├── store/
│   ├── builder-store.ts            # Zustand: builder.json là state gốc
│   ├── history-middleware.ts       # undo/redo
│   └── autosave-middleware.ts      # localStorage
└── lib/
    └── preview-bridge.ts           # nạp bản mock của zalo-bridge
```

Bố cục màn hình:

```
+-------------+---------------------+------------------+
| Thư viện    |   ┌───────────┐     | Thuộc tính       |
|             |   │  ▓▓▓▓▓▓▓  │     |                  |
| ▸ Chung     |   │  Băng rôn │ ⇕ ✕ | Ảnh    [+ thêm]  |
|   Băng rôn  |   ├───────────┤     | Tự chạy   [ON]   |
|   Chữ       |   │  Thực đơn │ ⇕ ✕ | Chiều cao [Vừa▾] |
|   Thư viện  |   ├───────────┤     |                  |
| ▸ Bán hàng  |   │  Đặt bàn  │ ⇕ ✕ |                  |
|   Sản phẩm  |   └───────────┘     |                  |
| ▸ Dịch vụ   |    khung điện thoại |                  |
+-------------+---------------------+------------------+
```

**State gốc chính là `builder.json`.** Không có state trung gian nào khác. Xuất file = lấy nguyên state đó đưa cho generator. Ít chỗ sai.

## Các bước

1. Dựng Next.js + Tailwind + shadcn/ui, layout ba cột
2. `builder-store.ts` bằng Zustand, kiểu dữ liệu lấy từ schema phase-01
3. `block-palette` đọc registry phase-03
4. `phone-frame` + `block-canvas` render block thật
5. Kéo thả bằng **dnd-kit** — kéo từ palette vào canvas, và sắp xếp trong canvas
6. `schema-form.tsx` — duyệt Zod schema sinh ra field tương ứng. Làm text/số/bool trước, rồi tới màu/ảnh/chọn
7. `page-manager` + `app-settings-form`
8. Middleware tự lưu + undo/redo
9. Nút **Xuất file** → gọi generator phase-02 → tải zip (phase 06 làm hoàn chỉnh)
10. **Mốc M2:** kéo thả xong → tải zip → giải nén → `npm i && zmp start` chạy được, không sửa tay

## Todo

- [ ] Dựng Next.js + Tailwind + shadcn/ui, layout ba cột
- [ ] `builder-store.ts` + test cho các hành động (thêm/xoá/đổi chỗ/sửa props)
- [ ] `block-palette` đọc registry
- [ ] `phone-frame` + render block thật trong đó
- [ ] Kéo thả bằng dnd-kit (từ palette vào canvas + sắp xếp trong canvas)
- [ ] `schema-form` — field text, số, bool
- [ ] `schema-form` — field màu, ảnh, chọn, mảng
- [ ] Quản lý nhiều trang + thanh tab
- [ ] Tự lưu localStorage
- [ ] Undo/redo
- [ ] Nút Xuất file nối vô generator
- [ ] **Mốc M2** đạt
- [ ] Test store bằng Vitest; test luồng kéo thả bằng Playwright

## Tiêu chí hoàn thành

- **M2 đạt:** kéo thả → tải zip → chạy được thật, không sửa tay dòng nào
- Thêm block mới ở phase-03 thì tự hiện trong palette và tự có form, không phải sửa code phase-04
- Tắt trình duyệt mở lại không mất việc đang làm
- Test store xanh, ít nhất 1 test Playwright đi hết luồng kéo thả → xuất file

## Rủi ro

| Rủi ro | Mức | Cách giảm |
|---|---|---|
| CSS của ZaUI đụng CSS của builder | Cao | Nhốt preview trong iframe, hoặc dùng Shadow DOM. Quyết ngay khi gặp, đừng chắp vá |
| Sinh form từ Zod gặp schema lồng nhau phức tạp | Trung bình | Giới hạn schema block ở mức nông; kiểu nào chưa hỗ trợ thì báo lỗi rõ ràng lúc build |
| Kéo thả trên di động khó dùng | Thấp | MVP nhắm desktop — khách là dev, ai làm việc này trên điện thoại đâu |
| localStorage đầy khi nhúng ảnh base64 | Trung bình | Ảnh lưu bằng URL, không nhúng base64. Có upload thì để bản sau |

## Bảo mật

- Người dùng nhập URL ảnh → validate là `https://`, chặn `javascript:` và `data:`
- Nội dung `rich-text` phải lọc trước khi render trong preview, không thì XSS ngay trong builder

## Bước kế tiếp

Phase 05 gắn nút "Kiểm tra trước khi nộp" vô thanh công cụ của giao diện này.
