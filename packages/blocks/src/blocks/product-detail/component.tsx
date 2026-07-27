import React from "react";
import { Box, Text, Button } from "zmp-ui";

export interface ProductDetailProps {
  productName?: string;
  price?: string;
  originalPrice?: string;
  description?: string;
  image?: string;
}

export default function ProductDetailBlock({
  productName = "Cà Phê Muối Đặc Biệt",
  price = "35.000đ",
  originalPrice = "45.000đ",
  description = "Hương vị cà phê đậm đà kết hợp cùng lớp kem muối béo ngậy.",
  image = "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=600&q=80",
}: ProductDetailProps) {
  return (
    <Box p={4} bg="white">
      <img
        src={image}
        alt={productName}
        style={{
          width: "100%",
          height: "220px",
          borderRadius: "8px",
          objectFit: "cover",
        }}
      />
      <Text.Title size="large" className="mt-3">
        {productName}
      </Text.Title>
      <Box className="flex items-center space-x-2 my-1">
        <Text size="large" color="red" bold>
          {price}
        </Text>
        {originalPrice && (
          <Text size="small" color="gray" style={{ textDecoration: "line-through" }}>
            {originalPrice}
          </Text>
        )}
      </Box>
      <Text size="medium" color="gray">
        {description}
      </Text>
      <Button fullWidth className="mt-4">
        Thêm vào giỏ hàng
      </Button>
    </Box>
  );
}
