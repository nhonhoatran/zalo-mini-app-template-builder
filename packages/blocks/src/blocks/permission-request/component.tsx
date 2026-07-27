import React from "react";
import { Box, Text, Button, Icon } from "zmp-ui";
import { zaloBridge } from "../../shared/zalo-bridge";

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
  const handleGrantPermission = async () => {
    try {
      const user = await zaloBridge.getUserInfo();
      alert(`Đã cấp quyền thành công cho user: ${user.name}`);
    } catch (err) {
      alert("Không thể lấy thông tin user.");
    }
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
