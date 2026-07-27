import React from "react";
import { Box, Text, Button } from "zmp-ui";

export interface ProductItem {
  id: string;
  name: string;
  price: string;
  image: string;
  category?: string;
}

export interface ProductListProps {
  title?: string;
  products?: ProductItem[];
}

export default function ProductListBlock({
  title = "Danh sách sản phẩm",
  products = [],
}: ProductListProps) {
  const displayProducts =
    products.length > 0
      ? products
      : [
          {
            id: "p1",
            name: "Cà phê sữa đá",
            price: "29.000đ",
            image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=300&q=80",
          },
        ];

  return (
    <Box p={4} bg="white">
      {title && (
        <Text.Title size="medium" className="mb-3">
          {title}
        </Text.Title>
      )}
      <Box className="space-y-3">
        {displayProducts.map((p) => (
          <Box
            key={p.id}
            style={{
              display: "flex",
              gap: "12px",
              alignItems: "center",
              borderBottom: "1px solid #f0f0f0",
              paddingBottom: "8px",
            }}
          >
            <img
              src={p.image}
              alt={p.name}
              style={{
                width: "60px",
                height: "60px",
                borderRadius: "6px",
                objectFit: "cover",
              }}
            />
            <Box style={{ flex: 1 }}>
              <Text bold size="medium">
                {p.name}
              </Text>
              <Text size="small" color="red">
                {p.price}
              </Text>
            </Box>
            <Button size="small">Chọn mua</Button>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
