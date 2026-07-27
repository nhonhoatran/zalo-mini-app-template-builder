import { z } from "zod";
import { BlockManifest } from "../../block-manifest-type";
import { SAMPLE_SERVICE_PRICE_LIST } from "./sample-data";

export interface ServiceItem {
  name: string;
  price: string;
  note?: string;
}

export interface ServicePriceListProps {
  title: string;
  services: ServiceItem[];
}

export const serviceItemSchema = z.object({
  name: z.string().min(1, "Tên dịch vụ không được trống"),
  price: z.string().min(1, "Giá dịch vụ không được trống"),
  note: z.string().optional(),
});

export const servicePriceListSchema = z.object({
  title: z.string().default("Bảng giá dịch vụ"),
  services: z.array(serviceItemSchema).min(1, "Bảng giá phải có ít nhất 1 dịch vụ"),
});

export const servicePriceListManifest: BlockManifest<ServicePriceListProps> = {
  type: "service-price-list",
  label: "Bảng giá dịch vụ",
  icon: "zi-list-1",
  category: "dich-vu",
  propsSchema: servicePriceListSchema,
  defaultProps: {
    title: "Menu & Bảng giá dịch vụ",
    services: SAMPLE_SERVICE_PRICE_LIST,
  },
  permissions: [],
  dependencies: {
    "zmp-ui": "^1.0.0",
  },
  usesSampleData: (props) =>
    props.services.some((s) => SAMPLE_SERVICE_PRICE_LIST.some((sp) => sp.name === s.name)),
  componentPath: "src/components/blocks/service-price-list.tsx",
  componentContent: `import React from "react";
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
`,
};
