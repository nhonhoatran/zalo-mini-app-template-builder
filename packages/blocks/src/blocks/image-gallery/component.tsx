import React from "react";
import { Box, Text } from "zmp-ui";

export interface ImageGalleryProps {
  title?: string;
  images?: string[];
  columns?: number;
}

export default function ImageGalleryBlock({
  title = "Bộ sưu tập ảnh",
  images = [],
  columns = 2,
}: ImageGalleryProps) {
  const displayImages =
    images.length > 0
      ? images
      : [
          "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=500&q=80",
          "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=500&q=80",
        ];

  return (
    <Box p={4} bg="white">
      {title && (
        <Text.Title size="medium" className="mb-3">
          {title}
        </Text.Title>
      )}
      <Box
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gap: "8px",
        }}
      >
        {displayImages.map((img, idx) => (
          <img
            key={idx}
            src={img}
            alt={`Gallery ${idx + 1}`}
            style={{
              width: "100%",
              borderRadius: "8px",
              height: "120px",
              objectFit: "cover",
            }}
          />
        ))}
      </Box>
    </Box>
  );
}
