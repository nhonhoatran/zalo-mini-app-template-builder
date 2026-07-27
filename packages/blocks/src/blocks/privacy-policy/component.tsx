import React from "react";
import { Box, Text } from "zmp-ui";

export interface PrivacyPolicyProps {
  appName?: string;
  contactEmail?: string;
  updatedAt?: string;
}

export default function PrivacyPolicyBlock({
  appName = "Ứng dụng Zalo",
  contactEmail = "hotro@domain.com",
  updatedAt = "2026-07-27",
}: PrivacyPolicyProps) {
  return (
    <Box p={4} bg="white">
      <Text.Title size="large" className="mb-3">
        Chính sách bảo mật
      </Text.Title>
      <Text size="medium" className="mb-2">
        Ứng dụng {appName} cam kết bảo vệ quyền riêng tư và thông tin cá nhân của người dùng tuân thủ tiêu chuẩn của Zalo Mini App Platform.
      </Text>
      <Text size="small" color="gray" className="mb-2">
        Mọi dữ liệu cá nhân thu thập (nếu có) chỉ được sử dụng cho mục đích vận hành ứng dụng và phục vụ khách hàng. Chúng tôi không chia sẻ thông tin cho bên thứ ba khi chưa có sự đồng ý của bạn.
      </Text>
      <Text size="xSmall" color="gray">
        Email liên hệ: {contactEmail} | Cập nhật ngày: {updatedAt}
      </Text>
    </Box>
  );
}
