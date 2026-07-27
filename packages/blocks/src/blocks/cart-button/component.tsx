import React from "react";
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
