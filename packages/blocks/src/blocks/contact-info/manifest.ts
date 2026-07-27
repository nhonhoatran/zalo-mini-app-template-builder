import { z } from "zod";
import { BlockManifest } from "../../block-manifest-type";
import { SAMPLE_CONTACT_DATA } from "./sample-data";

export interface ContactInfoProps {
  phone: string;
  address: string;
  workingHours: string;
  showCallButton: boolean;
}

export const contactInfoSchema = z.object({
  phone: z.string().min(8, "Số điện thoại không hợp lệ"),
  address: z.string().min(5, "Địa chỉ không hợp lệ"),
  workingHours: z.string().default("08:00 - 22:00 Hàng ngày"),
  showCallButton: z.boolean().default(true),
});

export const contactInfoManifest: BlockManifest<ContactInfoProps> = {
  type: "contact-info",
  label: "Thông tin liên hệ",
  icon: "zi-call",
  category: "chung",
  propsSchema: contactInfoSchema,
  defaultProps: SAMPLE_CONTACT_DATA,
  permissions: [],
  dependencies: {
    "zmp-ui": "^1.11.14",
  },
  usesSampleData: (props) => props.phone === SAMPLE_CONTACT_DATA.phone,
  componentPath: "src/components/blocks/contact-info.tsx",
  componentContent: `import React from "react";
import { Box, Text, Icon, Button } from "zmp-ui";

export interface ContactInfoProps {
  phone?: string;
  address?: string;
  workingHours?: string;
  showCallButton?: boolean;
}

export default function ContactInfoBlock({
  phone = "0909123456",
  address = "123 Nguyễn Huệ, Q.1, TP.HCM",
  workingHours = "08:00 - 22:00 Hàng ngày",
  showCallButton = true,
}: ContactInfoProps) {
  const handleCall = () => {
    if (typeof window !== "undefined" && (window as any).zmp?.openPhone) {
      (window as any).zmp.openPhone({ phoneNumber: phone });
    } else {
      window.location.href = \`tel:\${phone}\`;
    }
  };

  return (
    <Box p={4} bg="white">
      <Text.Title size="medium" className="mb-3">
        Thông tin liên hệ
      </Text.Title>
      <Box className="space-y-2">
        <Text size="medium">
          <Icon icon="zi-call" /> SĐT: {phone}
        </Text>
        <Text size="medium">
          <Icon icon="zi-location" /> Địa chỉ: {address}
        </Text>
        <Text size="medium">
          <Icon icon="zi-clock-1" /> Giờ mở cửa: {workingHours}
        </Text>
      </Box>
      {showCallButton && (
        <Button fullWidth className="mt-3" onClick={handleCall}>
          Gọi ngay Hotline
        </Button>
      )}
    </Box>
  );
}
`,
};
