import { describe, it, expect } from "vitest";
import { emitRouter } from "./emit-router";

describe("emitRouter", () => {
  it("generates src/app.tsx with routes and privacy page automatically registered", () => {
    const file = emitRouter([
      {
        id: "home",
        title: "Trang chủ",
        path: "/",
        showInTabBar: true,
        icon: "zi-home",
        blocks: [],
      },
    ]);

    expect(file.path).toBe("src/app.tsx");
    expect(file.content).toContain('import HomePage from "./pages/home";');
    expect(file.content).toContain('import PrivacyPage from "./pages/privacy";');
    expect(file.content).toContain('<Route path="/" element={<HomePage />} />');
    expect(file.content).toContain('<Route path="/privacy" element={<PrivacyPage />} />');
    expect(file.content).toContain('<BottomNavigation');
  });
});
