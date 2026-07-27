import { describe, it, expect } from "vitest";
import { emitPackageJson } from "./emit-package-json";

describe("emitPackageJson", () => {
  it("merges dependencies and updates app name", () => {
    const base = JSON.stringify({
      name: "base-app",
      dependencies: { react: "^18.2.0" },
    });

    const file = emitPackageJson(base, { "date-fns": "^3.0.0" }, "Cà Phê Sáng");
    expect(file.path).toBe("package.json");
    const json = JSON.parse(file.content);
    expect(json.name).toBe("c--ph--s-ng");
    expect(json.dependencies.react).toBe("^18.2.0");
    expect(json.dependencies["date-fns"]).toBe("^3.0.0");
  });

  it("throws error on version conflict", () => {
    const base = JSON.stringify({
      name: "base-app",
      dependencies: { react: "^18.2.0" },
    });

    expect(() =>
      emitPackageJson(base, { react: "^17.0.0" })
    ).toThrowError(/Version conflict/);
  });
});
