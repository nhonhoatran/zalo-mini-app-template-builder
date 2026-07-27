import React from "react";
import { Box, Text, Icon, Button } from "zmp-ui";
import { zaloBridge } from "../../shared/zalo-bridge";

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
    zaloBridge.openPhone(phone);
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
