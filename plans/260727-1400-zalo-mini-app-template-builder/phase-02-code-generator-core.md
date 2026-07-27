# Phase 02 — Lõi sinh code

**Ưu tiên:** Cao nhất | **Trạng thái:** ⬜ Chưa làm | **Ước lượng:** 4–5 ngày

Liên kết: [plan.md](plan.md) · [phase-01](phase-01-verify-constraints-and-spec.md) · [phase-03](phase-03-block-library.md)

## Tổng quan

Trái tim sản phẩm: `builder.json` vào → project Zalo Mini App chạy được ra. Làm trước giao diện vì đây là phần rủi ro nhất — giao diện đẹp mà sinh không nổi project chạy được thì bỏ.

## Nhận định then chốt

**Không sinh code bằng chuỗi ghép hay AST.** Cách KISS nhất mà lại đúng nhất: 90% file là **copy nguyên si** từ thư mục template + thư viện block. Chỉ ~10% là file thật sự phải sinh động (page ráp block, config, router).

```
Project sinh ra = [template gốc bất biến]
                + [copy component của các block đang dùng]
                + [sinh ~5 file ráp chúng lại]
```

Lợi ích: code trong output là code người viết, đọc được, sửa được — dev mua về không thấy "code máy sinh ra". Đây cũng là điểm bán hàng.

## Yêu cầu

**Chức năng**
- Nhận `builder.json` đã validate → trả về cây file (đường dẫn → nội dung)
- Chỉ copy component của block thực sự được dùng, không nhét cả thư viện
- Sinh `package.json` với đúng dependency mà các block đó cần (union, khử trùng)
- Sinh `app-config.json` từ `app.primaryColor`, `app.name`...
- Nhúng `builder.json` vô output để nhập lại được
- Luôn sinh trang chính sách bảo mật, không có cờ tắt
- Sinh `README.md` hướng dẫn `npm i` → `zmp login` → `zmp deploy` + checklist giấy tờ trước khi nộp duyệt

**Phi chức năng**
- Chạy được **trong trình duyệt** (không đụng `fs`) — vì MVP không có backend. Trả về cấu trúc dữ liệu, việc zip để phase 06 lo
- Sinh xong dưới 2 giây với app 5 trang
- Cùng một input phải cho ra cùng một output, byte-for-byte (trừ mốc thời gian) — để test được

## Kiến trúc

```
packages/generator/
├── src/
│   ├── generate-project.ts        # điều phối, export hàm chính
│   ├── emit-page.ts               # builder.json.pages[] -> src/pages/*.tsx
│   ├── emit-router.ts             # đăng ký Route (chỗ nào tuỳ kết quả phase-01)
│   ├── emit-app-config.ts         # -> app-config.json
│   ├── emit-package-json.ts       # gom dependency từ manifest các block
│   ├── emit-privacy-page.ts       # trang chính sách bắt buộc
│   ├── emit-readme.ts             # hướng dẫn deploy + checklist duyệt
│   ├── collect-block-files.ts     # copy component của block đang dùng
│   └── virtual-file-tree.ts       # kiểu dữ liệu { path: string; content: string }[]
└── templates/
    └── base-app/                  # project zmp trống, copy nguyên si
```

Luồng dữ liệu:

```
builder.json
   │ validate bằng Zod (phase-01)
   ▼
generate-project.ts
   ├─ copy templates/base-app/**            (bất biến)
   ├─ collect-block-files()                 (copy component block đang dùng)
   ├─ emit-page() cho từng page             (sinh động)
   ├─ emit-router / app-config / package.json
   ├─ emit-privacy-page / emit-readme
   └─▶ VirtualFileTree
```

Ví dụ file page sinh ra — chỉ là ráp, không có ma thuật:

```tsx
// src/pages/home.tsx  — sinh bởi builder, sửa tay thoải mái
import { Page } from "zmp-ui";
import Banner from "../components/blocks/banner";
import ProductList from "../components/blocks/product-list";

export default function HomePage() {
  return (
    <Page className="page">
      <Banner images={["/statics/b1.jpg"]} autoplay />
      <ProductList title="Thực đơn" source="mock" />
    </Page>
  );
}
```

## File tạo ra

Toàn bộ `packages/generator/` như cây trên, kèm test cho từng `emit-*`.

## Các bước

1. Chép project mẫu từ phase-01 làm `templates/base-app/`, lược hết phần thừa cho tới mức tối thiểu chạy được
2. Định nghĩa `VirtualFileTree` + hàm gộp cây, phát hiện trùng đường dẫn
3. Viết `emit-app-config` (dễ nhất, làm trước để chạy thông đường ống)
4. Viết `collect-block-files` — dựa trên manifest ở phase-03; giai đoạn này dùng 1 block giả để khỏi chờ phase-03
5. Viết `emit-page` — ráp block theo thứ tự, sinh import, truyền props
6. Viết `emit-router` theo đúng cách phase-01 xác minh được
7. Viết `emit-package-json` — gom dependency, cùng tên khác version thì báo lỗi rõ ràng
8. Viết `emit-privacy-page` + `emit-readme`
9. Viết script dev `scripts/generate-to-disk.ts` (chạy Node, chỉ dùng lúc phát triển) để ghi cây file ra đĩa mà kiểm bằng tay
10. **Kiểm bằng tay cho bằng được:** viết `builder.json` mẫu → sinh ra đĩa → `npm i && zmp start` → chạy thật

## Todo

- [ ] Rút gọn `templates/base-app/` tới mức tối thiểu chạy được
- [ ] `VirtualFileTree` + gộp cây + bắt trùng path
- [ ] `emit-app-config` + test
- [ ] `collect-block-files` + test
- [ ] `emit-page` + test (kể cả trường hợp 0 block, 1 block, nhiều page)
- [ ] `emit-router` + test
- [ ] `emit-package-json` + test (gồm ca xung đột version)
- [ ] `emit-privacy-page`, `emit-readme`
- [ ] `scripts/generate-to-disk.ts`
- [ ] **Mốc M1:** builder.json viết tay → generate → `npm i && zmp start` chạy được thật
- [ ] Test ảnh chụp (snapshot) cho toàn bộ cây file của một app mẫu

## Tiêu chí hoàn thành

- **M1 đạt:** project sinh ra chạy được bằng `zmp start`, không sửa tay dòng nào
- `tsc --noEmit` sạch trên project sinh ra — code sinh ra mà lỗi type thì mất uy tín liền
- Test phủ mọi hàm `emit-*`, có test cho cả app rỗng lẫn app nhiều trang
- Generator không import `fs`/`path` của Node ở nhánh code chạy trong trình duyệt

## Rủi ro

| Rủi ro | Mức | Cách giảm |
|---|---|---|
| Code sinh ra lỗi type/lint mà không hay | Cao | Test bắt buộc chạy `tsc --noEmit` trên output; đưa vô CI |
| Xung đột version dependency giữa các block | Trung bình | Manifest ghi version dạng khoảng; xung đột thì fail sớm với thông báo rõ |
| Sinh chuỗi bằng tay ra code xấu, thụt lề lung tung | Thấp | Chạy Prettier lên output trước khi trả về |
| Cách đăng ký Route đổi theo version `zmp-cli` | Trung bình | Cô lập trong đúng một file `emit-router.ts` |

## Bảo mật

- Escape mọi giá trị người dùng nhập khi nhét vô code sinh ra — tên app chứa dấu `"` hay backtick là hỏng file, tệ hơn là chèn được code
- Không cho `builder.json` chỉ định đường dẫn file tuỳ ý (path traversal) — đường dẫn output chỉ sinh từ danh sách trắng

## Bước kế tiếp

Phase 03 (thư viện block) cấp nguyên liệu cho `collect-block-files`. Phase 04 gọi generator này từ giao diện.
