import { z } from "zod";

/**
 * MVP Block Types defined in Phase 01
 */
export const MVP_BLOCK_TYPES = [
  // General / Display blocks
  "banner",
  "rich-text",
  "image-gallery",
  "contact-info",
  "map-location",
  // E-commerce / Sales blocks
  "product-list",
  "product-detail",
  "cart-button",
  // Services blocks
  "booking-form",
  "service-price-list",
  // Mandatory system blocks
  "privacy-policy",
  "permission-request",
] as const;

export type MvpBlockType = (typeof MVP_BLOCK_TYPES)[number];

/**
 * Block Permission Mapping
 * Permissions are derived strictly from used blocks to avoid requesting unused permissions.
 */
export const BLOCK_REQUIRED_PERMISSIONS: Record<MvpBlockType, string[]> = {
  "banner": [],
  "rich-text": [],
  "image-gallery": [],
  "contact-info": [],
  "map-location": ["location"],
  "product-list": [],
  "product-detail": [],
  "cart-button": [],
  "booking-form": ["userInfo", "phoneNumber"],
  "service-price-list": [],
  "privacy-policy": [],
  "permission-request": ["userInfo"],
};

/**
 * App Metadata Schema
 */
export const AppMetaSchema = z.object({
  name: z
    .string()
    .min(2, "Tên ứng dụng phải từ 2 ký tự trở lên")
    .max(50, "Tên ứng dụng không vượt quá 50 ký tự")
    .refine(
      (val) => val !== val.toUpperCase() || val.length < 4,
      "Tên ứng dụng không được viết IN HOA toàn bộ"
    )
    .refine(
      (val) => /^[\p{L}\p{N}\s\-_]+$/u.test(val),
      "Tên ứng dụng không chứa ký tự đặc biệt hợp lệ"
    ),
  description: z
    .string()
    .max(500, "Mô tả không vượt quá 500 ký tự")
    .default(""),
  primaryColor: z
    .string()
    .regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, "Mã màu Hex không hợp lệ (ví dụ: #006af5)")
    .default("#006af5"),
  oaId: z.string().optional().default(""),
  locale: z.enum(["vi", "en"]).default("vi"),
});

/**
 * Block Schema
 */
export const BlockSchema = z.object({
  id: z.string().min(1, "Block ID là bắt buộc"),
  type: z.enum(MVP_BLOCK_TYPES, {
    errorMap: () => ({ message: "Loại block không nằm trong danh sách MVP" }),
  }),
  props: z.record(z.unknown()).default({}),
});

/**
 * Page Schema
 */
export const PageSchema = z.object({
  id: z.string().min(1, "Page ID là bắt buộc"),
  title: z.string().min(1, "Tiêu đề trang là bắt buộc"),
  path: z
    .string()
    .startsWith("/", "Đường dẫn trang phải bắt đầu bằng '/'"),
  showInTabBar: z.boolean().default(false),
  icon: z.string().optional().default("zi-home"),
  blocks: z.array(BlockSchema).default([]),
});

/**
 * Main Builder Schema (builder.json)
 */
export const BuilderSchema = z.object({
  version: z.literal(1, {
    errorMap: () => ({ message: "Phiên bản schema phải là 1" }),
  }),
  app: AppMetaSchema,
  pages: z
    .array(PageSchema)
    .min(1, "Ứng dụng phải có ít nhất 1 trang")
    .refine(
      (pages) => pages.some((p) => p.path === "/"),
      "Ứng dụng phải có ít nhất 1 trang chủ với path '/'"
    ),
  permissions: z.array(z.string()).default([]),
  generated: z
    .object({
      at: z.string().default(() => new Date().toISOString()),
      builderVersion: z.string().default("1.0.0"),
    })
    .default({ at: new Date().toISOString(), builderVersion: "1.0.0" }),
});

export type AppMeta = z.infer<typeof AppMetaSchema>;
export type BlockConfig = z.infer<typeof BlockSchema>;
export type PageConfig = z.infer<typeof PageSchema>;
export type BuilderConfig = z.infer<typeof BuilderSchema>;

/**
 * Derive permissions automatically from pages and blocks in builder JSON.
 * Enforces rule: Permissions are NEVER manually typed by users.
 */
export function derivePermissions(pages: PageConfig[]): string[] {
  const permSet = new Set<string>();
  for (const page of pages) {
    for (const block of page.blocks) {
      const reqPerms = BLOCK_REQUIRED_PERMISSIONS[block.type] ?? [];
      for (const p of reqPerms) {
        permSet.add(p);
      }
    }
  }
  return Array.from(permSet).sort();
}

/**
 * Parse and validate builder.json data, automatically enriching derived permissions.
 */
export function parseAndValidateBuilderConfig(raw: unknown): BuilderConfig {
  const parsed = BuilderSchema.parse(raw);
  const derived = derivePermissions(parsed.pages);
  return {
    ...parsed,
    permissions: derived,
  };
}
