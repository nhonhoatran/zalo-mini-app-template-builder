import coffeeShopConfig from "./coffee-shop.json";
import spaSalonConfig from "./spa-salon.json";
import retailShopConfig from "./retail-shop.json";
import { BuilderConfig } from "@zalo-builder/schema";

export interface StarterTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  icon: string;
  color: string;
  tags: string[];
  config: BuilderConfig;
}

export const STARTER_TEMPLATES: StarterTemplate[] = [
  {
    id: "coffee-shop",
    name: "Quán Cà Phê & F&B",
    category: "Ẩm thực & Đồ uống",
    description: "Mẫu ứng dụng đặt món, hiển thị menu đồ uống, giỏ hàng, tích điểm & Zalo OA.",
    icon: "Coffee",
    color: "#b91c1c",
    tags: ["F&B", "Menu", "Giỏ hàng", "Voucher"],
    config: coffeeShopConfig as BuilderConfig,
  },
  {
    id: "spa-salon",
    name: "Spa & Salon Làm Đẹp",
    category: "Dịch vụ & Làm đẹp",
    description: "Mẫu ứng dụng đặt lịch chăm sóc da, massage, danh mục dịch vụ & Zalo OA.",
    icon: "Sparkles",
    color: "#db2777",
    tags: ["Spa", "Đặt lịch", "Làm đẹp", "Thành viên"],
    config: spaSalonConfig as BuilderConfig,
  },
  {
    id: "retail-shop",
    name: "Cửa Hàng Bán Lẻ / Thời Trang",
    category: "Bán lẻ & E-Commerce",
    description: "Mẫu cửa hàng bán lẻ, catalogue sản phẩm, giỏ hàng thanh toán & liên hệ.",
    icon: "ShoppingBag",
    color: "#0f766e",
    tags: ["Thời trang", "Catalogue", "ZaloPay", "Lê Văn Sỹ"],
    config: retailShopConfig as BuilderConfig,
  },
];

export function getStarterTemplateById(id: string): StarterTemplate | undefined {
  return STARTER_TEMPLATES.find((t) => t.id === id);
}
