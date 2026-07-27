import { z } from "zod";
import { BlockManifest } from "../../block-manifest-type";
import { SAMPLE_PRODUCT_DETAIL } from "./sample-data";

export interface ProductDetailProps {
  productName: string;
  price: string;
  originalPrice?: string;
  description: string;
  image: string;
}

export const productDetailSchema = z.object({
  productName: z.string().min(1, "Tên sản phẩm là bắt buộc"),
  price: z.string().min(1, "Giá sản phẩm là bắt buộc"),
  originalPrice: z.string().optional(),
  description: z.string().default("Mô tả chi tiết sản phẩm"),
  image: z.string().url(),
});

export const productDetailManifest: BlockManifest<ProductDetailProps> = {
  type: "product-detail",
  label: "Chi tiết sản phẩm",
  icon: "zi-document",
  category: "ban-hang",
  propsSchema: productDetailSchema,
  defaultProps: SAMPLE_PRODUCT_DETAIL,
  permissions: [],
  dependencies: {
    "zmp-ui": "^1.11.14",
  },
  usesSampleData: (props) => props.productName === SAMPLE_PRODUCT_DETAIL.productName,
  componentPath: "src/components/blocks/product-detail.tsx",
  componentContent: `import React from "react";
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
`,
};
