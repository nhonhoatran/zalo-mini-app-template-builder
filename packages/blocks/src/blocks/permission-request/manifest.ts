import { z } from "zod";
import { BlockManifest } from "../../block-manifest-type";
import { SAMPLE_PERMISSION_REQUEST } from "./sample-data";

export interface PermissionRequestProps {
  title: string;
  reason: string;
  buttonText: string;
}

export const permissionRequestSchema = z.object({
  title: z.string().default("Yêu cầu quyền truy cập Zalo"),
  reason: z.string().min(10, "Lý do xin quyền phải rõ ràng (ít nhất 10 ký tự) để tránh bị từ chối kiểm duyệt"),
  buttonText: z.string().default("Cấp quyền truy cập"),
});

export const permissionRequestManifest: BlockManifest<PermissionRequestProps> = {
  type: "permission-request",
  label: "Màn xin quyền Zalo",
  icon: "zi-lock",
  category: "bat-buoc",
  propsSchema: permissionRequestSchema,
  defaultProps: SAMPLE_PERMISSION_REQUEST,
  permissions: ["userInfo"],
  dependencies: {
    "zmp-ui": "^1.0.0",
  },
  usesSampleData: (props) => props.reason === SAMPLE_PERMISSION_REQUEST.reason,
  componentPath: "src/components/blocks/permission-request.tsx",
  componentContent: `import React from "react";
import { Box, Text, Button, Icon } from "zmp-ui";

export interface PermissionRequestProps {
  title?: string;
  reason?: string;
  buttonText?: string;
}

export default function PermissionRequestBlock({
  title = "Yêu cầu quyền truy cập Zalo",
  reason = "Ứng dụng cần quyền xem thông tin cá nhân cơ bản để cá nhân hóa dịch vụ.",
  buttonText = "Cấp quyền truy cập",
}: PermissionRequestProps) {
  const handleGrantPermission = () => {
    alert("Đã gửi yêu cầu xin quyền Zalo");
  };

  return (
    <Box p={4} bg="white" className="text-center">
      <Box className="flex justify-center mb-2">
        <Icon icon="zi-lock" size={40} style={{ color: "#006af5" }} />
      </Box>
      <Text.Title size="medium" className="mb-2">
        {title}
      </Text.Title>
      <Text size="medium" color="gray" className="mb-4">
        {reason}
      </Text>
      <Button fullWidth onClick={handleGrantPermission}>
        {buttonText}
      </Button>
    </Box>
  );
}
`,
};
