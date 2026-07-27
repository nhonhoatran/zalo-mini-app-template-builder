# Phase 03 — Thư viện block

**Ưu tiên:** Cao | **Trạng thái:** ✅ Đã hoàn thành (2026-07-27) | **Ước lượng:** 4–5 ngày

Liên kết: [plan.md](plan.md) · [phase-01](phase-01-verify-constraints-and-spec.md) · [phase-02](phase-02-code-generator-core.md)

## Tổng quan

Xây 10 block MVP. Mỗi block là một component React thật dùng ZaUI, kèm manifest mô tả thuộc tính. Chạy song song được với phase 02.

## Nhận định then chốt

**Một file component, dùng ở ba chỗ.** Cùng một `component.tsx` được:
1. Render trong preview của builder
2. Copy nguyên si vô project sinh ra
3. Sinh ra form chỉnh sửa bên phải (từ `propsSchema` trong manifest)

Nhờ vậy **preview không thể lệch với code output** — vì nó là cùng một file. Đây là lý do phase-01 phải kiểm `zmp-ui` trên web trước.

Hệ quả bắt buộc: component **không được gọi thẳng `zmp-sdk`**. Mọi lời gọi nền tảng đi qua `services/zalo-bridge.ts` — bản thật trong output, bản mock trong preview.

## Yêu cầu

**Chức năng**
- 10 block, mỗi block: hoàn chỉnh, không có nút chết, không có chữ "đang phát triển" (lỗi kiểm duyệt #1)
- Mỗi block khai rõ quyền cần dùng → generator gom lại thành `permissions` (lỗi #3)
- Mỗi block có dữ liệu mẫu để preview ra hình ngay, nhưng validator phải phân biệt được "dữ liệu mẫu chưa thay" (lỗi #1)
- Chỉ dùng component `zmp-ui`, không tự chế UI thay thế

**Phi chức năng**
- Chỉ dùng Tailwind + ZaUI, không kéo thêm thư viện UI khác
- Mỗi component dưới 200 dòng (theo development-rules)
- Responsive mặc định — không đặt chiều rộng cứng

## Kiến trúc

```
packages/blocks/
├── src/
│   ├── registry.ts                 # gom tất cả manifest, tra theo type
│   ├── block-manifest-type.ts      # kiểu chung cho manifest
│   └── blocks/
│       ├── banner/
│       │   ├── manifest.ts
│       │   ├── component.tsx       # ← dùng cho CẢ preview lẫn output
│       │   └── sample-data.ts
│       ├── product-list/
│       ├── booking-form/
│       └── ...
└── shared/
    └── zalo-bridge.ts              # bọc zmp-sdk; có bản mock cho preview
```

Manifest trông như vầy:

```ts
export const bannerManifest: BlockManifest = {
  type: "banner",
  label: "Băng rôn ảnh",
  icon: "zi-photo",
  category: "chung",
  propsSchema: z.object({
    images: z.array(z.string().url()).min(1).max(8),
    autoplay: z.boolean().default(true),
    height: z.enum(["thap", "vua", "cao"]).default("vua"),
  }),
  defaultProps: { images: [SAMPLE_IMAGE], autoplay: true, height: "vua" },
  permissions: [],                      // block này không cần quyền gì
  dependencies: { "zmp-ui": "^1.0.0" }, // gộp vô package.json output
  usesSampleData: (props) => props.images.includes(SAMPLE_IMAGE),
};
```

`propsSchema` gánh ba việc một lúc: validate `builder.json`, sinh form chỉnh sửa, và làm tài liệu. DRY đúng nghĩa.

## Danh sách block MVP

| Type | Nhóm | Quyền cần | Ghi chú |
|---|---|---|---|
| `banner` | Chung | — | Carousel bằng `Swiper` của ZaUI |
| `rich-text` | Chung | — | Soạn thảo cơ bản, sinh ra HTML tĩnh đã lọc |
| `image-gallery` | Chung | — | Lưới ảnh |
| `contact-info` | Chung | — | SĐT/địa chỉ; nút gọi dùng API Zalo, **không mở link ngoài** (lỗi #4) |
| `map-location` | Chung | `location`? | Kiểm phase-01 xem ZaUI có sẵn map không |
| `product-list` | Bán hàng | — | Danh sách + lọc theo nhóm |
| `product-detail` | Bán hàng | — | Trang chi tiết, đi kèm `product-list` |
| `cart-button` | Bán hàng | — | Nút giỏ hàng nổi; **không đụng nạp tiền/ví** (lỗi #2) |
| `booking-form` | Dịch vụ | `userInfo`, `phoneNumber` | Chọn khung giờ; đây là chỗ anh có sẵn kinh nghiệm |
| `service-price-list` | Dịch vụ | — | Bảng dịch vụ + giá |
| `privacy-policy` | Bắt buộc | — | Tự sinh, không tắt được |
| `permission-request` | Bắt buộc | — | Màn hình xin quyền đúng chuẩn, kèm giải thích mục đích |

## Các bước

1. Định nghĩa `BlockManifest` + `registry.ts`
2. Viết `zalo-bridge.ts` — bản thật gọi `zmp-sdk`, bản mock trả dữ liệu giả; chọn bản nào bằng biến môi trường
3. Làm `banner` **trọn gói làm mẫu** (manifest + component + sample + test) rồi mới nhân bản cách làm ra các block khác
4. Làm 4 block nhóm Chung
5. Làm 3 block nhóm Bán hàng
6. Làm 2 block nhóm Dịch vụ
7. Làm 2 block bắt buộc
8. Viết test cho `registry` — mọi block phải có đủ manifest hợp lệ

## Todo

- [x] `BlockManifest` + `registry.ts` + test
- [x] `zalo-bridge.ts` bản thật + bản mock
- [x] Block `banner` trọn gói (làm mẫu cho phần còn lại)
- [x] `rich-text`, `image-gallery`, `contact-info`, `map-location`
- [x] `product-list`, `product-detail`, `cart-button`
- [x] `booking-form`, `service-price-list`
- [x] `privacy-policy`, `permission-request`
- [x] Test: mọi block trong registry đều parse được `defaultProps` bằng chính `propsSchema` của nó
- [x] Ghép thử với generator phase-02: sinh app có đủ 10 block → `zmp start` chạy

## Tiêu chí hoàn thành

- 12 block chạy được cả trong preview lẫn trong app sinh ra
- Không block nào có nút bấm không phản hồi hay chữ "coming soon"
- Mọi block đều dưới 200 dòng
- Test registry xanh; `defaultProps` của mọi block đều hợp lệ theo schema của nó

## Rủi ro

| Rủi ro | Mức | Cách giảm |
|---|---|---|
| Component chạy trong preview nhưng chết trong app thật | Cao | Bắt buộc thử ghép với phase-02 sau mỗi nhóm block, đừng để tới cuối |
| Block dính `zmp-sdk` trực tiếp làm preview vỡ | Trung bình | Đặt luật lint cấm import `zmp-sdk` ngoài `zalo-bridge.ts` |
| Block quá cứng, khách không đủ tuỳ biến | Trung bình | Chấp nhận ở MVP. Nghe phản hồi khách rồi mới nới, đừng đoán trước (YAGNI) |
| Ảnh mẫu dính bản quyền | Thấp | Chỉ dùng ảnh giấy phép tự do, ghi nguồn |

## Bảo mật

- `rich-text` sinh ra HTML → **bắt buộc lọc bằng DOMPurify hoặc allowlist thẻ**, cả ở preview lẫn ở output. Đây là chỗ dễ dính XSS nhất
- `booking-form` xin `phoneNumber` → phải kèm giải thích mục đích trên màn hình xin quyền, không thì rớt duyệt

## Bước kế tiếp

Registry là nguồn dữ liệu cho bảng chọn block và form chỉnh sửa ở phase 04.
