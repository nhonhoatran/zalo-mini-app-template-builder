# Phase 06 — Xuất / nhập lại + đóng gói

**Ưu tiên:** Trung bình | **Trạng thái:** ✅ Hoàn thành | **Ước lượng:** 2–3 ngày

Liên kết: [plan.md](plan.md) · [phase-02](phase-02-code-generator-core.md) · [phase-05](phase-05-compliance-validator.md)

## Tổng quan

Hoàn thiện luồng xuất file, làm tính năng nhập lại `builder.json` để sửa tiếp, và đóng gói sản phẩm cho ra dáng bán được.

## Nhận định then chốt

**Nhập lại `builder.json` là tính năng giữ chân khách.** Chi phí gần bằng không (state gốc vốn đã là `builder.json`) nhưng đổi lại: khách quay lại builder mỗi lần cần sửa app, thay vị xài một lần rồi thôi. Đây là thứ biến "bán template một lần" thành "công cụ dùng lâu dài".

## Yêu cầu

**Chức năng**
- Đóng gói cây file thành `.zip` ngay trong trình duyệt, tải về
- Còn lỗi ❌ thì cảnh báo trước khi xuất, nhưng vẫn cho ép xuất
- Nhập `builder.json` (kéo file vô hoặc chọn file) → dựng lại y nguyên trạng thái
- Nhập file schema version cũ → tự nâng cấp, hoặc báo lỗi rõ ràng nếu không nâng được
- Kèm trong zip: `README.md` hướng dẫn deploy, báo cáo kiểm duyệt, `builder.json`
- Có 3 dự án mẫu dựng sẵn (quán cà phê, spa, cửa hàng) để bấm phát là có

**Phi chức năng**
- Zip app 5 trang xong dưới 3 giây
- Không cần backend

## Kiến trúc

```
apps/builder/
├── lib/
│   ├── export/
│   │   ├── build-zip.ts            # VirtualFileTree -> Blob bằng JSZip
│   │   ├── download-zip.ts
│   │   └── export-flow.ts          # validate -> generate -> zip -> tải
│   ├── import/
│   │   ├── parse-builder-file.ts   # đọc + validate + nâng version
│   │   └── schema-migrations.ts    # v1 -> v2 -> ...
│   └── starters/
│       ├── coffee-shop.json
│       ├── spa-salon.json
│       └── retail-shop.json
└── components/
    ├── export-dialog.tsx
    ├── import-dropzone.tsx
    └── starter-picker.tsx
```

Nội dung zip xuất ra:

```
ten-app-cua-ban/
├── src/                        # code thật, chạy được
├── statics/
├── app-config.json
├── package.json
├── builder.json                # ← quăng ngược vô builder để sửa tiếp
├── COMPLIANCE-REPORT.md        # báo cáo từ phase-05
└── README.md                   # hướng dẫn deploy + checklist giấy tờ
```

`README.md` sinh ra phải có đủ:

```markdown
## Chạy thử
npm install && zmp start

## Đưa lên Zalo
zmp login && zmp deploy

## Trước khi nộp duyệt — tự kiểm
- [ ] Đã thay hết ảnh và nội dung mẫu
- [ ] Tên app trên Zalo khớp tên trong app-config.json
- [ ] Đã có GPKD / giấy ủy quyền thương hiệu (nếu ngành có điều kiện)
- [ ] Tên doanh nghiệp trên GPKD khớp Zalo OA
- [ ] Mô tả app khớp với tính năng thật
```

## Các bước

1. `build-zip.ts` bằng JSZip + `download-zip.ts`
2. `export-flow.ts` — nối validate (phase-05) → generate (phase-02) → zip
3. `export-dialog.tsx` — hiện kết quả kiểm duyệt trước khi cho tải
4. `parse-builder-file.ts` + `import-dropzone.tsx`
5. `schema-migrations.ts` — hiện chỉ có v1, nhưng dựng sẵn khung
6. Dựng 3 dự án mẫu bằng chính builder rồi lưu JSON lại
7. `starter-picker.tsx` — màn hình chào, chọn mẫu hoặc bắt đầu trống
8. Viết `docs/getting-started.md` cho người mua

## Todo

- [x] `build-zip.ts` + test (kiểm cấu trúc zip)
- [x] `export-flow.ts` nối đủ ba khâu
- [x] `export-dialog.tsx` có cảnh báo lỗi ❌
- [x] `parse-builder-file.ts` + test (file hợp lệ, file hỏng, file sai version)
- [x] `import-dropzone.tsx`
- [x] Khung `schema-migrations.ts`
- [x] 3 dự án mẫu + `starter-picker.tsx`
- [x] `docs/getting-started.md`
- [x] Test Vitest đi trọn vòng: chọn mẫu → sửa → xuất → nhập lại → khớp y nguyên

## Tiêu chí hoàn thành

- Xuất zip → giải nén → `npm i && zmp start` chạy được
- Xuất rồi nhập lại cho ra đúng `builder.json` ban đầu (kiểm bằng test so sánh)
- 3 dự án mẫu đều xuất được và chạy được
- README trong zip đủ để người chưa biết gì cũng deploy được

## Rủi ro

| Rủi ro | Mức | Cách giảm |
|---|---|---|
| Zip lớn làm trình duyệt đơ | Thấp | Không nhét `node_modules`; ảnh dùng URL chứ không nhúng |
| Nhập file `builder.json` độc hại | Trung bình | Validate bằng Zod trước khi đụng tới; không bao giờ `eval` |
| Khách sửa tay code rồi nhập lại builder → mất phần sửa tay | **Cao** | Ghi cảnh báo to trong README: "sinh lại sẽ đè lên `src/`". Bản sau tính chuyện chỉ sinh đè file do builder quản |
| Người dùng chưa cài `zmp-cli` không biết làm gì | Thấp | README ghi rõ bước cài |

## Bảo mật

- File `builder.json` nhập vô là dữ liệu **không đáng tin** → validate Zod nghiêm ngặt, giới hạn dung lượng file, không parse nếu quá lớn
- URL ảnh trong file nhập vô phải validate lại y như lúc nhập tay
- Không đưa `.env` hay bất kỳ secret nào vô zip

## Bước kế tiếp

Xong phase này là có MVP bán được. Việc tiếp theo (ngoài phạm vi plan này, làm sau khi có phản hồi khách):

- **Mốc M4:** nộp một app sinh từ builder lên Zalo duyệt thật → đậu → dùng làm bằng chứng bán hàng
- Landing page + định giá (one-time hay thuê bao)
- Cấp phép / khoá bản quyền
- Bộ block chuyên ngành thứ hai
- Cập nhật bộ luật kiểm duyệt định kỳ — có thể bán thành gói riêng
