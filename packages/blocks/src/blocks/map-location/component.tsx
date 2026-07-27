import React from "react";
import { Box, Text, Button } from "zmp-ui";
import { zaloBridge } from "../../shared/zalo-bridge";

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
  const handleDirections = async () => {
    await zaloBridge.getLocation();
    alert(`Đang mở chỉ đường tới tọa độ (${latitude}, ${longitude})`);
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
