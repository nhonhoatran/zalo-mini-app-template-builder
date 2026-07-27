import { BuilderConfig, parseAndValidateBuilderConfig } from "@zalo-builder/schema";
import { migrateBuilderConfig } from "./schema-migrations";

export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

export type ParseResult =
  | {
      success: true;
      config: BuilderConfig;
      migrated: boolean;
      originalVersion: number;
    }
  | {
      success: false;
      errors: string[];
    };

/**
 * Reads a JSON string or File, migrates schema if needed, and validates builder.json structure.
 */
export async function parseBuilderFile(input: string | File | unknown): Promise<ParseResult> {
  let jsonString = "";

  if (typeof input === "string") {
    jsonString = input;
  } else if (typeof window !== "undefined" && input instanceof File) {
    if (input.size > MAX_FILE_SIZE_BYTES) {
      return {
        success: false,
        errors: [`Dung lượng file quá lớn (${(input.size / (1024 * 1024)).toFixed(2)} MB). Giới hạn tối đa là 5 MB.`],
      };
    }
    try {
      jsonString = await input.text();
    } catch (err) {
      return {
        success: false,
        errors: ["Không thể đọc nội dung file. Vui lòng chọn file JSON hợp lệ."],
      };
    }
  } else if (typeof input === "object" && input !== null) {
    jsonString = JSON.stringify(input);
  } else {
    return {
      success: false,
      errors: ["Đầu vào không hợp lệ. Cần truyền chuỗi JSON hoặc File."],
    };
  }

  // 1. JSON Parse
  let rawParsed: unknown;
  try {
    rawParsed = JSON.parse(jsonString);
  } catch (err) {
    return {
      success: false,
      errors: ["File không đúng định dạng JSON. Vui lòng kiểm tra cú pháp file builder.json."],
    };
  }

  // 2. Schema Migration
  const migrationResult = migrateBuilderConfig(rawParsed);

  // 3. Validate Zod Schema
  try {
    const validatedConfig = parseAndValidateBuilderConfig(migrationResult.data);
    return {
      success: true,
      config: validatedConfig,
      migrated: migrationResult.migrated,
      originalVersion: migrationResult.fromVersion,
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Cấu trúc builder.json không khớp schema.";
    return {
      success: false,
      errors: [errorMsg],
    };
  }
}
