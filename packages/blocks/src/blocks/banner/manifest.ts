import { z } from "zod";
import { BlockManifest } from "../../block-manifest-type";
import { SAMPLE_BANNER_IMAGES } from "./sample-data";

export interface BannerProps {
  images: string[];
  autoplay: boolean;
  height: "thap" | "vua" | "cao";
}

export const bannerSchema = z.object({
  images: z.array(z.string().url()).min(1, "Băng rôn cần ít nhất 1 hình ảnh").max(8),
  autoplay: z.boolean().default(true),
  height: z.enum(["thap", "vua", "cao"]).default("vua"),
});

export const bannerManifest: BlockManifest<BannerProps> = {
  type: "banner",
  label: "Băng rôn ảnh",
  icon: "zi-photo",
  category: "chung",
  propsSchema: bannerSchema,
  defaultProps: {
    images: SAMPLE_BANNER_IMAGES,
    autoplay: true,
    height: "vua",
  },
  permissions: [],
  dependencies: {
    "zmp-ui": "^1.11.14",
  },
  usesSampleData: (props) =>
    props.images.some((img) => SAMPLE_BANNER_IMAGES.includes(img)),
  componentPath: "src/components/blocks/banner.tsx",
  componentContent: `import React from "react";
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
              alt={\`Banner \${idx + 1}\`}
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
`,
};
