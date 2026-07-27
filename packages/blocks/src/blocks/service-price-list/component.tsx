import React from "react";
import { Box, Text } from "zmp-ui";

export interface ServiceItem {
  name: string;
  price: string;
  note?: string;
}

export interface ServicePriceListProps {
  title?: string;
  services?: ServiceItem[];
}

export default function ServicePriceListBlock({
  title = "Bảng giá dịch vụ",
  services = [],
}: ServicePriceListProps) {
  const displayServices =
    services.length > 0
      ? services
      : [
          { name: "Dịch vụ cơ bản", price: "100.000đ", note: "Mô tả dịch vụ" },
        ];

  return (
    <Box p={4} bg="white">
      {title && (
        <Text.Title size="medium" className="mb-3">
          {title}
        </Text.Title>
      )}
      <Box className="space-y-2">
        {displayServices.map((s, idx) => (
          <Box
            key={idx}
            style={{
              padding: "10px 0",
              borderBottom: "1px solid #f0f0f0",
            }}
          >
            <Box style={{ display: "flex", justifyContent: "space-between" }}>
              <Text bold size="medium">
                {s.name}
              </Text>
              <Text bold size="medium" color="blue">
                {s.price}
              </Text>
            </Box>
            {s.note && (
              <Text size="xSmall" color="gray" className="mt-1">
                {s.note}
              </Text>
            )}
          </Box>
        ))}
      </Box>
    </Box>
  );
}
