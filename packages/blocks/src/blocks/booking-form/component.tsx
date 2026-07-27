import React, { useState } from "react";
import { Box, Text, Input, Button } from "zmp-ui";
import { zaloBridge } from "../../shared/zalo-bridge";

export interface BookingFormProps {
  title?: string;
  subtitle?: string;
  submitButtonText?: string;
}

export default function BookingFormBlock({
  title = "Đặt lịch hẹn",
  subtitle = "Điền thông tin bên dưới để hoàn tất đặt lịch",
  submitButtonText = "Gửi yêu cầu đặt lịch",
}: BookingFormProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");

  const handleGetInfo = async () => {
    const user = await zaloBridge.getUserInfo();
    if (user?.name) {
      setName(user.name);
    }
  };

  const handleSubmit = () => {
    if (!name || !phone) {
      alert("Vui lòng điền họ tên và số điện thoại!");
      return;
    }
    alert(`Đặt lịch thành công cho ${name} - ${phone} vào ngày ${date || "Hôm nay"}`);
  };

  return (
    <Box p={4} bg="white">
      <Text.Title size="medium" className="mb-1">
        {title}
      </Text.Title>
      {subtitle && (
        <Text size="small" color="gray" className="mb-3">
          {subtitle}
        </Text>
      )}
      <Box className="space-y-3">
        <Input
          label="Họ và tên"
          placeholder="Nhập họ tên"
          value={name}
          onChange={(e: any) => setName(e.target.value)}
        />
        <Input
          label="Số điện thoại"
          placeholder="Nhập số điện thoại"
          value={phone}
          onChange={(e: any) => setPhone(e.target.value)}
        />
        <Input
          label="Ngày hẹn"
          type="date"
          value={date}
          onChange={(e: any) => setDate(e.target.value)}
        />
        <Button
          fullWidth
          variant="secondary"
          size="small"
          onClick={handleGetInfo}
          className="mb-2"
        >
          Lấy thông tin từ Zalo
        </Button>
        <Button fullWidth onClick={handleSubmit}>
          {submitButtonText}
        </Button>
      </Box>
    </Box>
  );
}
