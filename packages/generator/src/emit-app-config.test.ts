import { describe, it, expect } from "vitest";
import { emitAppConfig } from "./emit-app-config";

describe("emitAppConfig", () => {
  it("generates valid app-config.json file", () => {
    const file = emitAppConfig({
      name: "Cà Phê Sáng",
      description: "App đặt cà phê",
      primaryColor: "#006af5",
      oaId: "",
      locale: "vi",
    });

    expect(file.path).toBe("app-config.json");
    const json = JSON.parse(file.content);
    expect(json.app.title).toBe("Cà Phê Sáng");
    expect(json.app.headerColor).toBe("#006af5");
  });
});
