import { z } from "zod";
import { BlockManifest } from "../../block-manifest-type";
import { SAMPLE_CART_BUTTON } from "./sample-data";

export interface CartButtonProps {
  buttonText: string;
  itemCount: number;
  totalPrice: string;
}

export const cartButtonSchema = z.object({
  buttonText: z.string().default("Xem giỏ hàng"),
  itemCount: z.number().min(0).default(2),
  totalPrice: z.string().default("68.000đ"),
});

export const cartButtonManifest: BlockManifest<CartButtonProps> = {
  type: "cart-button",
  label: "Nút giỏ hàng nổi",
  icon: "zi-cart",
  category: "ban-hang",
  propsSchema: cartButtonSchema,
  defaultProps: SAMPLE_CART_BUTTON,
  permissions: [],
  dependencies: {
    "zmp-ui": "^1.11.14",
  },
  usesSampleData: (props) => props.totalPrice === SAMPLE_CART_BUTTON.totalPrice,
  componentPath: "src/components/blocks/cart-button.tsx",
  componentContent: `import React from "react";
import { Box, Button, Text } from "zmp-ui";

export interface CartButtonProps {
  buttonText?: string;
  itemCount?: number;
  totalPrice?: string;
}

export default function CartButtonBlock({
  buttonText = "Xem giỏ hàng",
  itemCount = 2,
  totalPrice = "68.000đ",
}: CartButtonProps) {
  return (
    <Box
      style={{
        position: "fixed",
        bottom: "16px",
        left: "16px",
        right: "16px",
        zIndex: 100,
      }}
    >
      <Button
        fullWidth
        style={{
          display: "flex",
          justify: "space-between",
          alignItems: "center",
          borderRadius: "12px",
        }}
      >
        <Text color="white" bold>
          {buttonText} ({itemCount} món)
        </Text>
        <Text color="white" bold>
          {totalPrice}
        </Text>
      </Button>
    </Box>
  );
}
`,
};
