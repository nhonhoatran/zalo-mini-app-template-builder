import { z } from "zod";
import { BlockManifest } from "../../block-manifest-type";
import { SAMPLE_RICH_TEXT_CONTENT } from "./sample-data";

export interface RichTextProps {
  title: string;
  content: string;
}

export const richTextSchema = z.object({
  title: z.string().default("Giới thiệu"),
  content: z.string().min(1, "Nội dung văn bản không được để trống"),
});

export const richTextManifest: BlockManifest<RichTextProps> = {
  type: "rich-text",
  label: "Văn bản định dạng",
  icon: "zi-edit-text",
  category: "chung",
  propsSchema: richTextSchema,
  defaultProps: {
    title: "Về chúng tôi",
    content: SAMPLE_RICH_TEXT_CONTENT,
  },
  permissions: [],
  dependencies: {
    "zmp-ui": "^1.11.14",
  },
  usesSampleData: (props) => props.content === SAMPLE_RICH_TEXT_CONTENT,
  componentPath: "src/components/blocks/rich-text.tsx",
  componentContent: `import React from "react";
import { Box, Text } from "zmp-ui";

export interface RichTextProps {
  title?: string;
  content?: string;
}

function sanitizeHtml(html: string): string {
  if (!html) return "";
  return html
    .replace(/<script\\b[^<]*(?:(?!<\\/script>)<[^<]*)*<\\/script>/gi, "")
    .replace(/on\\w+="[^"]*"/gi, "")
    .replace(/javascript:/gi, "");
}

export default function RichTextBlock({
  title = "Giới thiệu",
  content = "<p>Nội dung giới thiệu chi tiết...</p>",
}: RichTextProps) {
  const safeContent = sanitizeHtml(content);

  return (
    <Box p={4} bg="white">
      {title && (
        <Text.Title size="large" className="mb-2">
          {title}
        </Text.Title>
      )}
      <div
        style={{ fontSize: "14px", lineHeight: "1.6", color: "#333" }}
        dangerouslySetInnerHTML={{ __html: safeContent }}
      />
    </Box>
  );
}
`,
};
