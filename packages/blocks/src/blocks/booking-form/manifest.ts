import { z } from "zod";
import { BlockManifest } from "../../block-manifest-type";
import { SAMPLE_BOOKING_FORM } from "./sample-data";

export interface BookingFormProps {
  title: string;
  subtitle: string;
  submitButtonText: string;
}

export const bookingFormSchema = z.object({
  title: z.string().default("Đặt lịch hẹn"),
  subtitle: z.string().default("Điền thông tin bên dưới để hoàn tất đặt lịch"),
  submitButtonText: z.string().default("Gửi yêu cầu đặt lịch"),
});

export const bookingFormManifest: BlockManifest<BookingFormProps> = {
  type: "booking-form",
  label: "Form đặt lịch",
  icon: "zi-calendar",
  category: "dich-vu",
  propsSchema: bookingFormSchema,
  defaultProps: SAMPLE_BOOKING_FORM,
  permissions: ["userInfo", "phoneNumber"],
  dependencies: {
    "zmp-ui": "^1.11.14",
  },
  usesSampleData: (props) => props.title === SAMPLE_BOOKING_FORM.title,
  componentPath: "src/components/blocks/booking-form.tsx",
  componentContent: `import React, { useState } from "react";
import { Box, Text, Input, Button } from "zmp-ui";

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

  const handleSubmit = () => {
    if (!name || !phone) {
      alert("Vui lòng điền họ tên và số điện thoại!");
      return;
    }
    alert(\`Đặt lịch thành công cho \${name} - \${phone} vào ngày \${date || "Hôm nay"}\`);
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
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          label="Số điện thoại"
          placeholder="Nhập số điện thoại"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <Input
          label="Ngày hẹn"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <Button fullWidth onClick={handleSubmit} className="mt-2">
          {submitButtonText}
        </Button>
      </Box>
    </Box>
  );
}
`,
};
