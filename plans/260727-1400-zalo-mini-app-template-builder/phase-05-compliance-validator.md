# Phase 05 — Validator kiểm duyệt

**Ưu tiên:** Cao nhất về mặt kinh doanh | **Trạng thái:** ✅ Hoàn thành | **Ước lượng:** 2–3 ngày

Liên kết: [plan.md](plan.md) · [research/zalo-platform-findings.md](research/zalo-platform-findings.md) mục 3

## Tổng quan

Nút **"Kiểm tra trước khi nộp"** — quét `builder.json` và cây file sinh ra, báo những gì sẽ khiến Zalo từ chối.

## Nhận định then chốt

**Đây mới là món hàng.** Kéo thả thì ai cũng làm được; thứ khiến dev móc ví là khỏi bị Zalo đá ngược ba lần. Phase này ngắn nhất nhưng giá trị cao nhất — cho nên đừng làm qua loa: mỗi lỗi phải chỉ đúng chỗ và nói rõ cách sửa.

Một chi tiết dễ bỏ sót: **luật kiểm duyệt sẽ đổi**. Nên mỗi luật là một file riêng có phiên bản, không nhét hết vô một hàm `validate()` khổng lồ. Về sau bán được bản "cập nhật luật hàng tháng" luôn.

## Yêu cầu

**Chức năng**
- Chạy được toàn bộ luật lên `builder.json` + cây file output
- Ba mức: ❌ Sẽ bị từ chối · ⚠️ Rủi ro · ℹ️ Việc cần tự lo
- Mỗi phát hiện: mã lỗi, mô tả tiếng Việt, chỉ đúng block/trang dính lỗi, cách sửa cụ thể, và **bấm vô là nhảy tới chỗ đó trong builder**
- Xuất được báo cáo dạng markdown để kèm hồ sơ nộp duyệt
- Checklist giấy tờ (mục ℹ️) tích tay được, lưu cùng dự án

**Phi chức năng**
- Chạy dưới 1 giây
- Mỗi luật một file, khai báo rõ version và nguồn căn cứ

## Kiến trúc

```
packages/compliance/
├── src/
│   ├── run-compliance-check.ts     # chạy hết luật, gom kết quả
│   ├── rule-type.ts                # kiểu chung
│   ├── rules/
│   │   ├── app-name-format.ts              # lỗi #6
│   │   ├── no-external-links.ts            # lỗi #4
│   │   ├── no-placeholder-content.ts       # lỗi #1
│   │   ├── no-unfinished-features.ts       # lỗi #1
│   │   ├── privacy-policy-present.ts       # lỗi #3
│   │   ├── permissions-minimal.ts          # lỗi #3
│   │   ├── no-sensitive-payment.ts         # lỗi #2
│   │   ├── description-matches-blocks.ts   # lỗi #5
│   │   └── manual-checklist.ts             # lỗi #7 — chỉ nhắc
│   └── report/
│       └── emit-markdown-report.ts
```

Một luật trông như vầy:

```ts
export const appNameFormat: ComplianceRule = {
  code: "ZMA-006",
  severity: "error",
  title: "Tên Mini App không hợp lệ",
  source: "research/zalo-platform-findings.md#3 — lỗi số 6",
  check(ctx) {
    const name = ctx.builder.app.name;
    const found = [];
    if (name === name.toUpperCase() && /[A-Z]/.test(name))
      found.push({ message: "Tên đang IN HOA toàn bộ", fix: "Chỉ viết hoa chữ cái đầu: " + toTitleCase(name), path: "app.name" });
    if (/[^\p{L}\p{N}\s\-&.]/u.test(name))
      found.push({ message: "Tên chứa ký tự đặc biệt", fix: "Bỏ ký tự lạ, giữ chữ và số", path: "app.name" });
    return found;
  },
};
```

## Bộ luật MVP

Ánh xạ thẳng từ bảng ở research mục 3.

| Mã | Luật | Mức | Bắt cái gì |
|---|---|---|---|
| ZMA-001 | `no-placeholder-content` | ❌ | Block còn dữ liệu mẫu chưa thay (dựa vào `usesSampleData` trong manifest) |
| ZMA-002 | `no-unfinished-features` | ❌ | Chữ "đang phát triển", "coming soon", "TODO" trong nội dung |
| ZMA-003 | `privacy-policy-present` | ❌ | Thiếu trang chính sách bảo mật |
| ZMA-004 | `permissions-minimal` | ❌ | Khai quyền mà không block nào dùng tới |
| ZMA-005 | `no-external-links` | ❌ | URL trỏ ra ngoài Zalo trong props của block |
| ZMA-006 | `app-name-format` | ❌ | IN HOA toàn bộ, ký tự đặc biệt, tên rỗng |
| ZMA-007 | `no-sensitive-payment` | ⚠️ | Có dấu hiệu nạp tiền / đổi điểm ra tiền mặt |
| ZMA-008 | `description-matches-blocks` | ⚠️ | Mô tả app nhắc tính năng mà không có block tương ứng |
| ZMA-009 | `manual-checklist` | ℹ️ | GPKD, giấy ủy quyền thương hiệu, tên OA khớp — builder không kiểm được |

## Các bước

1. `rule-type.ts` + `run-compliance-check.ts` (chạy được với 0 luật trước đã)
2. Viết ZMA-006 trọn gói làm mẫu (dễ kiểm chứng nhất)
3. Viết ZMA-001 → ZMA-005
4. Viết ZMA-007, ZMA-008
5. `manual-checklist.ts` — danh sách tĩnh, tích tay được
6. Panel kết quả trong giao diện: nhóm theo mức, bấm là nhảy tới block
7. `emit-markdown-report.ts`
8. **Ưu tiên:** Cao nhất về mặt kinh doanh | **Trạng thái:** ✅ Hoàn thành | **Ước lượng:** 2–3 ngày

---

## Todo

- [x] `rule-type.ts` + `run-compliance-check.ts` + test
- [x] ZMA-006 + test
- [x] ZMA-001 → ZMA-005, mỗi luật kèm test có ca đúng và ca sai
- [x] ZMA-007, ZMA-008 + test
- [x] ZMA-009 checklist tích tay
- [x] Panel kết quả + bấm nhảy tới block
- [x] Xuất báo cáo markdown
- [x] **Mốc M3** đạt
- [x] Viết `docs/compliance-rules.md` giải thích từng mã lỗi — vừa là tài liệu vừa là nội dung SEO

## Tiêu chí hoàn thành

- 9 luật chạy, mỗi luật có test ca đúng lẫn ca sai
- App vi phạm → bắt đủ; app sạch → không báo lỗi giả
- Bấm vô lỗi là nhảy đúng block đang dính
- Báo cáo markdown xuất được, đọc lọt

## Rủi ro

| Rủi ro | Mức | Cách giảm |
|---|---|---|
| **Bộ luật dựa trên blog agency, không phải doc chính chủ** | **Cao** | Trên giao diện ghi rõ căn cứ từng luật. Landing page nói thật: "giảm rủi ro bị từ chối", KHÔNG hứa "duyệt đậu 100%" |
| Báo lỗi giả làm khách bực, mất tin | Cao | Nghi ngờ thì để mức ⚠️ chứ đừng ❌. Luật nào cũng cho tắt được, có ghi lý do |
| Zalo đổi chính sách, luật lạc hậu | Trung bình | Mỗi luật có version + ngày cập nhật; hiện cảnh báo nếu bộ luật quá 90 ngày chưa rà |
| Quét chữ "coming soon" bắt nhầm nội dung hợp lệ | Thấp | Chỉ quét trong props văn bản, cho phép bỏ qua từng trường hợp |

## Bảo mật

Validator chỉ đọc, không sửa gì. Không có bề mặt tấn công đáng kể. Lưu ý duy nhất: báo cáo markdown xuất ra có thể chứa nội dung người dùng → escape khi hiển thị lại trên web.

## Bước kế tiếp

Phase 06 chặn nút Xuất file khi còn lỗi mức ❌ (nhưng vẫn cho ép xuất, có cảnh báo).
