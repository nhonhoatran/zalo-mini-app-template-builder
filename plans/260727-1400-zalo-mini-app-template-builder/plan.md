# Zalo Mini App Template Builder

Công cụ kéo thả giúp dev/agency dựng Zalo Mini App **đúng chuẩn ZaUI và đúng quy định kiểm duyệt**, xuất ra source code chạy được liền. Người dùng tự deploy và tự đi duyệt.

## Định vị

- **Khách hàng:** dev / agency / freelancer làm Zalo Mini App cho khách VN — KHÔNG phải chủ shop cuối
- **Bán cái gì:** không bán "kéo thả" (ai cũng làm được), bán **"sinh ra code duyệt là qua"**
- **Vũ khí:** validator chặn tự động 5/8 lỗi khiến app bị Zalo từ chối → xem `research/zalo-platform-findings.md` mục 3
- **Không làm (YAGNI):** không host runtime cho khách, không ôm deploy, không ôm kiểm duyệt, không canvas tự do

## Quyết định kiến trúc đã chốt

1. **Xuất source code thật**, không phải runtime đọc JSON — anh đã chốt
2. **Layout xếp khối theo hàng dọc** (kiểu Shopify theme editor), không canvas tọa độ tự do — anh đã chốt. Phụ lợi: không bao giờ vỡ layout → tự né lỗi kiểm duyệt #8
3. **Một block = một component React thật + một manifest.** Builder preview bằng CHÍNH component đó, generator COPY chính file đó vô output → preview và code sinh ra không thể lệch nhau. Không dùng AST/template engine
4. **MVP không cần backend.** Kéo thả ở client, lưu localStorage, đóng gói zip bằng JSZip ngay trên trình duyệt → deploy Vercel/Cloudflare Pages, chi phí ~0
5. **`builder.json` nhét luôn trong project sinh ra** → quăng ngược vô builder là sửa tiếp được

## Stack

Builder: Next.js + TypeScript + Tailwind + shadcn/ui + dnd-kit + JSZip
Output: React + TypeScript + Vite + zmp-vite-plugin + zmp-ui + zmp-sdk

## Các phase

| # | Phase | Trạng thái | Ước lượng |
|---|---|---|---|
| 01 | [Kiểm chứng ràng buộc + chốt đặc tả](phase-01-verify-constraints-and-spec.md) | ✅ Hoàn thành | 3–4 ngày |
| 02 | [Lõi sinh code](phase-02-code-generator-core.md) | ⬜ Chưa làm | 4–5 ngày |
| 03 | [Thư viện block](phase-03-block-library.md) | ⬜ Chưa làm | 4–5 ngày |
| 04 | [Giao diện builder](phase-04-builder-ui.md) | ⬜ Chưa làm | 4–5 ngày |
| 05 | [Validator kiểm duyệt](phase-05-compliance-validator.md) | ⬜ Chưa làm | 2–3 ngày |
| 06 | [Xuất / nhập lại + đóng gói](phase-06-export-reimport-packaging.md) | ⬜ Chưa làm | 2–3 ngày |

Tổng ~3–4 tuần cho MVP bán được.

## Thứ tự phụ thuộc

```
01 (kiểm chứng)
 └─> 02 (generator) ──┐
     03 (block)   ────┼──> 04 (UI) ──> 05 (validator) ──> 06 (đóng gói)
                      │
        02 và 03 làm song song được sau khi 01 chốt schema
```

**Làm 02 trước 04 là cố ý.** Sinh code là phần rủi ro nhất; giao diện đẹp mà không sinh nổi project chạy được thì vô nghĩa.

## Cột mốc chứng minh sản phẩm sống

- **M1 (cuối phase 02):** viết tay một `builder.json` → chạy generator → `npm i && zmp start` chạy được thật
- **M2 (cuối phase 04):** kéo thả trên UI → tải zip → chạy được thật, không sửa tay dòng nào
- **M3 (cuối phase 05):** cố tình tạo app lỗi → validator bắt đúng lỗi
- **M4:** nộp một app sinh từ builder lên Zalo duyệt thật → đậu. Đây là bằng chứng bán hàng mạnh nhất

## Rủi ro lớn nhất

`zmp-ui` có thể không render nổi ngoài môi trường Zalo → sập quyết định số 3 (preview dùng chung component). Phải kiểm **ngay ngày đầu** phase-01. Phương án dự phòng ghi trong phase-01.

## Tài liệu tham chiếu

- `research/zalo-platform-findings.md` — ràng buộc nền tảng + checklist kiểm duyệt
