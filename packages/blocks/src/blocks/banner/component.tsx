import React from "react";
import { Box, Swiper } from "zmp-ui";

export interface BannerProps {
  images?: string[];
  autoplay?: boolean;
  height?: "thap" | "vua" | "cao";
}

const HEIGHT_MAP = {
  thap: "140px",
  vua: "180px",
  cao: "240px",
};

export default function BannerBlock({
  images = [],
  autoplay = true,
  height = "vua",
}: BannerProps) {
  const displayImages =
    images.length > 0
      ? images
      : [
          "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80",
        ];

  const bannerHeight = HEIGHT_MAP[height] || HEIGHT_MAP.vua;

  return (
    <Box m={0} p={0}>
      <Swiper autoplay={autoplay} duration={3000}>
        {displayImages.map((img, idx) => (
          <Swiper.Slide key={idx}>
            <img
              src={img}
              alt={`Banner ${idx + 1}`}
              style={{
                width: "100%",
                height: bannerHeight,
                objectFit: "cover",
              }}
            />
          </Swiper.Slide>
        ))}
      </Swiper>
    </Box>
  );
}
