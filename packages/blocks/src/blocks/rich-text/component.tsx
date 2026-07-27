import React from "react";
import { Box, Text } from "zmp-ui";

export interface RichTextProps {
  title?: string;
  content?: string;
}

function sanitizeHtml(html: string): string {
  if (!html) return "";
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/on\w+="[^"]*"/gi, "")
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
