import { z } from "zod";
import { BlockManifest } from "../../block-manifest-type";
import { SAMPLE_MAP_LOCATION } from "./sample-data";

export interface MapLocationProps {
  addressName: string;
  latitude: number;
  longitude: number;
}

export const mapLocationSchema = z.object({
  addressName: z.string().min(2, "Tên địa điểm không hợp lệ"),
  latitude: z.number().default(10.7769),
  longitude: z.number().default(106.7009),
});

export const mapLocationManifest: BlockManifest<MapLocationProps> = {
  type: "map-location",
  label: "Bản đồ & Vị trí",
  icon: "zi-location",
  category: "chung",
  propsSchema: mapLocationSchema,
  defaultProps: SAMPLE_MAP_LOCATION,
  permissions: ["location"],
  dependencies: {
    "zmp-ui": "^1.11.14",
  },
  usesSampleData: (props) => props.addressName === SAMPLE_MAP_LOCATION.addressName,
  componentPath: "src/components/blocks/map-location.tsx",
  componentContent: `import React from "react";
import { Box, Text, Button } from "zmp-ui";

export interface MapLocationProps {
  addressName?: string;
  latitude?: number;
  longitude?: number;
}

export default function MapLocationBlock({
  addressName = "Vị trí cửa hàng",
  latitude = 10.7769,
  longitude = 106.7009,
}: MapLocationProps) {
  const handleDirections = () => {
    alert(\`Đang mở chỉ đường tới tọa độ (\${latitude}, \${longitude})\`);
  };

  return (
    <Box p={4} bg="white">
      <Text.Title size="medium" className="mb-2">
        {addressName}
      </Text.Title>
      <Box
        style={{
          width: "100%",
          height: "150px",
          backgroundColor: "#e2e8f0",
          borderRadius: "8px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text size="medium" bold color="gray">
          Bản đồ Zalo Map / Location
        </Text>
        <Text size="xSmall" color="gray">
          ({latitude}, {longitude})
        </Text>
      </Box>
      <Button fullWidth className="mt-3" variant="secondary" onClick={handleDirections}>
        Chỉ đường trên bản đồ
      </Button>
    </Box>
  );
}
`,
};
