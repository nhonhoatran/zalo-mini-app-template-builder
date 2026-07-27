import { describe, it, expect } from "vitest";
import { emitPage } from "./emit-page";

describe("emitPage", () => {
  it("generates page TSX code with block components and safe prop serialization", () => {
    const file = emitPage({
      id: "home",
      title: "Trang chủ",
      path: "/",
      showInTabBar: true,
      icon: "zi-home",
      blocks: [
        {
          id: "b1",
          type: "banner",
          props: { images: ["https://example.com/banner.png"], autoplay: true },
        },
        {
          id: "b2",
          type: "product-list",
          props: { title: 'Cà "Phê" Sáng' },
        },
      ],
    });

    expect(file.path).toBe("src/pages/home.tsx");
    expect(file.content).toContain('import BannerBlock from "../components/blocks/banner";');
    expect(file.content).toContain('import ProductListBlock from "../components/blocks/product-list";');
    expect(file.content).toContain('export default function HomePage()');
    expect(file.content).toContain('title={"Cà \\"Phê\\" Sáng"}');
    expect(file.content).toContain('autoplay={true}');
  });
});
