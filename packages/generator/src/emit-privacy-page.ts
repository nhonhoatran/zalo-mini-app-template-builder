import { AppMeta } from "@zalo-builder/schema";
import { VirtualFile } from "./virtual-file-tree";

export function emitPrivacyPage(appMeta: AppMeta): VirtualFile {
  const content = `import React from "react";
import { Page, Header, Box, Text } from "zmp-ui";

export default function PrivacyPage() {
  return (
    <Page className="page">
      <Header title="Chính sách bảo mật" showBack />
      <Box p={4} bg="white">
        <Text.Title size="large" className="mb-3">
          Chính sách bảo mật ứng dụng ${appMeta.name}
        </Text.Title>
        <Text size="medium" className="mb-2">
          Ứng dụng <strong>${appMeta.name}</strong> tôn trọng và cam kết bảo vệ quyền riêng tư của người dùng khi trải nghiệm ứng dụng trên nền tảng Zalo Mini App.
        </Text>
        <Text.Title size="medium" className="mt-4 mb-2">1. Thu thập thông tin</Text.Title>
        <Text size="medium" color="gray" className="mb-2">
          Ứng dụng chỉ thu thập các thông tin cần thiết (như họ tên, số điện thoại, vị trí) khi người dùng chủ động cho phép và cấp quyền thông qua giao diện chuẩn của Zalo.
        </Text>
        <Text.Title size="medium" className="mt-4 mb-2">2. Sử dụng thông tin</Text.Title>
        <Text size="medium" color="gray" className="mb-2">
          Mọi thông tin thu thập được chỉ sử dụng để vận hành các chức năng đặt hàng, liên hệ, phục vụ dịch vụ cho người dùng. Chúng tôi tuyệt đối không bán hoặc chia sẻ dữ liệu cho bên thứ ba.
        </Text>
        <Text.Title size="medium" className="mt-4 mb-2">3. Quyền của người dùng</Text.Title>
        <Text size="medium" color="gray" className="mb-2">
          Người dùng có thể quản lý, thu hồi quyền truy cập thông tin bất cứ lúc nào trong cài đặt quyền của Zalo.
        </Text>
      </Box>
    </Page>
  );
}
`;

  return {
    path: "src/pages/privacy.tsx",
    content,
  };
}
