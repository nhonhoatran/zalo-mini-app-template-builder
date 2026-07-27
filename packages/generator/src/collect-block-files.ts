import { BuilderConfig, MvpBlockType } from "@zalo-builder/schema";
import { VirtualFileTree } from "./virtual-file-tree";

export interface BlockManifest {
  type: MvpBlockType;
  componentPath: string;
  componentContent: string;
  dependencies?: Record<string, string>;
}

/**
 * Registry of block components for MVP.
 * In Phase 03, these block components will be rich library components.
 * For Phase 02 Core Generator, we define clean, production-ready TSX block templates for all 12 MVP block types.
 */
export const BLOCK_MANIFEST_REGISTRY: Record<MvpBlockType, BlockManifest> = {
  "banner": {
    type: "banner",
    componentPath: "src/components/blocks/banner.tsx",
    componentContent: `import React from "react";
import { Box, Swiper } from "zmp-ui";

export interface BannerProps {
  images?: string[];
  autoplay?: boolean;
}

export default function BannerBlock({ images = [], autoplay = true }: BannerProps) {
  const displayImages = images.length > 0 ? images : ["https://via.placeholder.com/600x250?text=Banner+Khuyen+Mai"];
  return (
    <Box m={0} p={0}>
      <Swiper autoplay={autoplay} duration={3000}>
        {displayImages.map((img, idx) => (
          <Swiper.Slide key={idx}>
            <img src={img} alt={\`Banner \${idx + 1}\`} style={{ width: "100%", height: "180px", objectFit: "cover" }} />
          </Swiper.Slide>
        ))}
      </Swiper>
    </Box>
  );
}
`,
  },
  "rich-text": {
    type: "rich-text",
    componentPath: "src/components/blocks/rich-text.tsx",
    componentContent: `import React from "react";
import { Box, Text } from "zmp-ui";

export interface RichTextProps {
  content?: string;
  title?: string;
}

export default function RichTextBlock({ title, content = "Nội dung giới thiệu chi tiết..." }: RichTextProps) {
  return (
    <Box p={4} bg="white">
      {title && <Text.Title size="large" className="mb-2">{title}</Text.Title>}
      <Text size="medium">{content}</Text>
    </Box>
  );
}
`,
  },
  "image-gallery": {
    type: "image-gallery",
    componentPath: "src/components/blocks/image-gallery.tsx",
    componentContent: `import React from "react";
import { Box, Text } from "zmp-ui";

export interface ImageGalleryProps {
  title?: string;
  images?: string[];
}

export default function ImageGalleryBlock({ title = "Bộ sưu tập ảnh", images = [] }: ImageGalleryProps) {
  const displayImages = images.length > 0 ? images : [
    "https://via.placeholder.com/300x200?text=Anh+1",
    "https://via.placeholder.com/300x200?text=Anh+2"
  ];
  return (
    <Box p={4} bg="white">
      {title && <Text.Title size="medium" className="mb-3">{title}</Text.Title>}
      <Box style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "8px" }}>
        {displayImages.map((img, idx) => (
          <img key={idx} src={img} alt="Gallery" style={{ width: "100%", borderRadius: "8px", height: "120px", objectFit: "cover" }} />
        ))}
      </Box>
    </Box>
  );
}
`,
  },
  "contact-info": {
    type: "contact-info",
    componentPath: "src/components/blocks/contact-info.tsx",
    componentContent: `import React from "react";
import { Box, Text, Icon } from "zmp-ui";

export interface ContactInfoProps {
  phone?: string;
  address?: string;
  workingHours?: string;
}

export default function ContactInfoBlock({
  phone = "0900 000 000",
  address = "123 Đường Nguyễn Huệ, Q.1, TP.HCM",
  workingHours = "08:00 - 22:00 Hàng ngày"
}: ContactInfoProps) {
  return (
    <Box p={4} bg="white">
      <Text.Title size="medium" className="mb-3">Thông tin liên hệ</Text.Title>
      <Box className="space-y-2">
        <Text size="medium"><Icon icon="zi-call" /> SĐT: {phone}</Text>
        <Text size="medium"><Icon icon="zi-location" /> Địa chỉ: {address}</Text>
        <Text size="medium"><Icon icon="zi-clock-1" /> Giờ mở cửa: {workingHours}</Text>
      </Box>
    </Box>
  );
}
`,
  },
  "map-location": {
    type: "map-location",
    componentPath: "src/components/blocks/map-location.tsx",
    componentContent: `import React from "react";
import { Box, Text, Button } from "zmp-ui";

export interface MapLocationProps {
  latitude?: number;
  longitude?: number;
  addressName?: string;
}

export default function MapLocationBlock({ addressName = "Vị trí cửa hàng" }: MapLocationProps) {
  return (
    <Box p={4} bg="white">
      <Text.Title size="medium" className="mb-2">{addressName}</Text.Title>
      <Box style={{ width: "100%", height: "150px", backgroundColor: "#e2e8f0", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Text size="small" color="gray">Bản đồ Google / Zalo Map</Text>
      </Box>
      <Button fullWidth className="mt-3" variant="secondary">Chỉ đường</Button>
    </Box>
  );
}
`,
  },
  "product-list": {
    type: "product-list",
    componentPath: "src/components/blocks/product-list.tsx",
    componentContent: `import React from "react";
import { Box, Text, Button } from "zmp-ui";

export interface ProductListProps {
  title?: string;
  source?: string;
}

export default function ProductListBlock({ title = "Danh sách sản phẩm" }: ProductListProps) {
  const dummyProducts = [
    { id: 1, name: "Cà phê sữa đá", price: "29.000đ", img: "https://via.placeholder.com/150?text=CaPheSua" },
    { id: 2, name: "Trà đào cam sả", price: "39.000đ", img: "https://via.placeholder.com/150?text=TraDao" },
  ];

  return (
    <Box p={4} bg="white">
      <Text.Title size="medium" className="mb-3">{title}</Text.Title>
      <Box className="space-y-3">
        {dummyProducts.map((p) => (
          <Box key={p.id} style={{ display: "flex", gap: "12px", alignItems: "center", borderBottom: "1px solid #f0f0f0", paddingBottom: "8px" }}>
            <img src={p.img} alt={p.name} style={{ width: "60px", height: "60px", borderRadius: "6px" }} />
            <Box style={{ flex: 1 }}>
              <Text bold size="medium">{p.name}</Text>
              <Text size="small" color="red">{p.price}</Text>
            </Box>
            <Button size="small">Thêm</Button>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
`,
  },
  "product-detail": {
    type: "product-detail",
    componentPath: "src/components/blocks/product-detail.tsx",
    componentContent: `import React from "react";
import { Box, Text, Button } from "zmp-ui";

export default function ProductDetailBlock() {
  return (
    <Box p={4} bg="white">
      <img src="https://via.placeholder.com/400x250?text=Product+Detail" alt="Detail" style={{ width: "100%", borderRadius: "8px" }} />
      <Text.Title size="large" className="mt-3">Cà Phê Muối Đặc Biệt</Text.Title>
      <Text size="large" color="red" bold className="my-1">35.000đ</Text>
      <Text size="medium" color="gray">Hương vị cà phê đậm đà kết hợp cùng lớp kem muối béo ngậy đặc trưng.</Text>
      <Button fullWidth className="mt-4">Thêm vào giỏ hàng</Button>
    </Box>
  );
}
`,
  },
  "cart-button": {
    type: "cart-button",
    componentPath: "src/components/blocks/cart-button.tsx",
    componentContent: `import React from "react";
import { Box, Button, Text } from "zmp-ui";

export default function CartButtonBlock() {
  return (
    <Box style={{ position: "fixed", bottom: "16px", left: "16px", right: "16px", zIndex: 100 }}>
      <Button fullWidth style={{ display: "flex", justifyContent: "space-between" }}>
        <Text color="white" bold>Giỏ hàng (2 món)</Text>
        <Text color="white" bold>68.000đ</Text>
      </Button>
    </Box>
  );
}
`,
  },
  "booking-form": {
    type: "booking-form",
    componentPath: "src/components/blocks/booking-form.tsx",
    componentContent: `import React, { useState } from "react";
import { Box, Text, Input, Button } from "zmp-ui";

export default function BookingFormBlock() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  return (
    <Box p={4} bg="white">
      <Text.Title size="medium" className="mb-3">Đặt lịch hẹn</Text.Title>
      <Box className="space-y-3">
        <Input label="Họ và tên" placeholder="Nhập họ tên" value={name} onChange={(e) => setName(e.target.value)} />
        <Input label="Số điện thoại" placeholder="Nhập SĐT" value={phone} onChange={(e) => setPhone(e.target.value)} />
        <Button fullWidth className="mt-2">Gửi yêu cầu đặt lịch</Button>
      </Box>
    </Box>
  );
}
`,
  },
  "service-price-list": {
    type: "service-price-list",
    componentPath: "src/components/blocks/service-price-list.tsx",
    componentContent: `import React from "react";
import { Box, Text } from "zmp-ui";

export default function ServicePriceListBlock() {
  const services = [
    { name: "Cắt tóc nam phong cách", price: "100.000đ" },
    { name: "Gội đầu dưỡng sinh", price: "150.000đ" },
  ];

  return (
    <Box p={4} bg="white">
      <Text.Title size="medium" className="mb-3">Bảng giá dịch vụ</Text.Title>
      {services.map((s, idx) => (
        <Box key={idx} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #f0f0f0" }}>
          <Text size="medium">{s.name}</Text>
          <Text bold size="medium" color="blue">{s.price}</Text>
        </Box>
      ))}
    </Box>
  );
}
`,
  },
  "privacy-policy": {
    type: "privacy-policy",
    componentPath: "src/components/blocks/privacy-policy.tsx",
    componentContent: `import React from "react";
import { Box, Text } from "zmp-ui";

export default function PrivacyPolicyBlock() {
  return (
    <Box p={4} bg="white">
      <Text.Title size="large" className="mb-3">Chính sách bảo mật</Text.Title>
      <Text size="medium" className="mb-2">
        Ứng dụng cam kết bảo vệ thông tin cá nhân của người dùng tuân thủ theo tiêu chuẩn kiểm duyệt của Zalo Mini App Platform.
      </Text>
      <Text size="small" color="gray">
        Mọi dữ liệu cá nhân thu thập (nếu có) chỉ nhằm phục vụ việc cung cấp dịch vụ và không chia sẻ cho bên thứ ba.
      </Text>
    </Box>
  );
}
`,
  },
  "permission-request": {
    type: "permission-request",
    componentPath: "src/components/blocks/permission-request.tsx",
    componentContent: `import React from "react";
import { Box, Text, Button } from "zmp-ui";

export default function PermissionRequestBlock() {
  return (
    <Box p={4} bg="white" className="text-center">
      <Text.Title size="medium" className="mb-2">Yêu cầu quyền truy cập</Text.Title>
      <Text size="medium" color="gray" className="mb-4">
        Ứng dụng cần quyền truy cập thông tin cá nhân cơ bản để cá nhân hóa trải nghiệm.
      </Text>
      <Button fullWidth>Cấp quyền</Button>
    </Box>
  );
}
`,
  },
};

/**
 * Collect all block component files required by the builder config.
 */
export function collectBlockFiles(builderConfig: BuilderConfig): {
  files: VirtualFileTree;
  dependencies: Record<string, string>;
} {
  const usedTypes = new Set<MvpBlockType>();

  // Always collect privacy-policy block
  usedTypes.add("privacy-policy");

  for (const page of builderConfig.pages) {
    for (const block of page.blocks) {
      usedTypes.add(block.type);
    }
  }

  const files: VirtualFileTree = [];
  const dependencies: Record<string, string> = {};

  for (const blockType of usedTypes) {
    const manifest = BLOCK_MANIFEST_REGISTRY[blockType];
    if (manifest) {
      files.push({
        path: manifest.componentPath,
        content: manifest.componentContent,
      });

      if (manifest.dependencies) {
        Object.assign(dependencies, manifest.dependencies);
      }
    }
  }

  return { files, dependencies };
}
