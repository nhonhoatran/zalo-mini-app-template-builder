import { z } from "zod";
import { BlockManifest } from "../../block-manifest-type";
import { SAMPLE_PRODUCTS } from "./sample-data";

export interface ProductItem {
  id: string;
  name: string;
  price: string;
  image: string;
  category?: string;
}

export interface ProductListProps {
  title: string;
  products: ProductItem[];
}

export const productItemSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Tên sản phẩm là bắt buộc"),
  price: z.string().min(1, "Giá sản phẩm là bắt buộc"),
  image: z.string().url(),
  category: z.string().optional(),
});

export const productListSchema = z.object({
  title: z.string().default("Danh sách sản phẩm"),
  products: z.array(productItemSchema).min(1, "Cần có ít nhất 1 sản phẩm"),
});

export const productListManifest: BlockManifest<ProductListProps> = {
  type: "product-list",
  label: "Danh sách sản phẩm",
  icon: "zi-box",
  category: "ban-hang",
  propsSchema: productListSchema,
  defaultProps: {
    title: "Sản phẩm nổi bật",
    products: SAMPLE_PRODUCTS,
  },
  permissions: [],
  dependencies: {
    "zmp-ui": "^1.11.14",
  },
  usesSampleData: (props) =>
    props.products.some((p) => SAMPLE_PRODUCTS.some((sp) => sp.id === p.id)),
  componentPath: "src/components/blocks/product-list.tsx",
  componentContent: `import React from "react";
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
`,
};
