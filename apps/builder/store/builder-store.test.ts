import { describe, it, expect, beforeEach } from "vitest";
import { useBuilderStore } from "./builder-store";

describe("builder-store", () => {
  beforeEach(() => {
    useBuilderStore.getState().resetToDefault();
  });

  it("initializes with default config and default page", () => {
    const state = useBuilderStore.getState();
    expect(state.config.app.name).toBe("Zalo Mini App Mẫu");
    expect(state.config.pages.length).toBe(1);
    expect(state.activePageId).toBe("page-home");
  });

  it("updates app metadata", () => {
    useBuilderStore.getState().setAppMeta({ name: "Cửa hàng Hoa Tươi", primaryColor: "#ff4d4f" });
    const state = useBuilderStore.getState();
    expect(state.config.app.name).toBe("Cửa hàng Hoa Tươi");
    expect(state.config.app.primaryColor).toBe("#ff4d4f");
  });

  it("adds a new page and switches active page", () => {
    const pageId = useBuilderStore.getState().addPage("Sản phẩm", "/products", true, "zi-grid");
    const state = useBuilderStore.getState();
    expect(state.config.pages.length).toBe(2);
    expect(state.activePageId).toBe(pageId);
    expect(state.config.pages[1].title).toBe("Sản phẩm");
  });

  it("adds a block and automatically derives required permissions", () => {
    const homePageId = useBuilderStore.getState().activePageId;
    useBuilderStore.getState().addBlock(homePageId, "booking-form");

    const state = useBuilderStore.getState();
    const homePage = state.config.pages.find((p) => p.id === homePageId);
    expect(homePage?.blocks.some((b) => b.type === "booking-form")).toBe(true);

    // booking-form requires ["userInfo", "phoneNumber"]
    expect(state.config.permissions).toContain("userInfo");
    expect(state.config.permissions).toContain("phoneNumber");
  });

  it("updates block props", () => {
    const homePageId = useBuilderStore.getState().activePageId;
    const blockId = useBuilderStore.getState().config.pages[0].blocks[0].id;

    useBuilderStore.getState().updateBlockProps(homePageId, blockId, { title: "Băng rôn khuyến mãi cực hot!" });

    const state = useBuilderStore.getState();
    const updatedBlock = state.config.pages[0].blocks[0];
    expect(updatedBlock.props.title).toBe("Băng rôn khuyến mãi cực hot!");
  });

  it("removes a block and clears permissions if no longer required", () => {
    const homePageId = useBuilderStore.getState().activePageId;
    const blockId = useBuilderStore.getState().addBlock(homePageId, "map-location");

    expect(useBuilderStore.getState().config.permissions).toContain("location");

    useBuilderStore.getState().removeBlock(homePageId, blockId);

    expect(useBuilderStore.getState().config.permissions).not.toContain("location");
  });

  it("reorders blocks on a page", () => {
    const homePageId = useBuilderStore.getState().activePageId;
    const page = useBuilderStore.getState().config.pages[0];
    const b0 = page.blocks[0].id;
    const b1 = page.blocks[1].id;

    useBuilderStore.getState().reorderBlocks(homePageId, b0, b1);

    const updatedPage = useBuilderStore.getState().config.pages[0];
    expect(updatedPage.blocks[0].id).toBe(b1);
    expect(updatedPage.blocks[1].id).toBe(b0);
  });

  it("supports undo and redo", () => {
    const store = useBuilderStore.getState();
    expect(store.canUndo()).toBe(false);

    store.setAppMeta({ name: "Tên Mới 1" });
    expect(useBuilderStore.getState().canUndo()).toBe(true);
    expect(useBuilderStore.getState().config.app.name).toBe("Tên Mới 1");

    useBuilderStore.getState().undo();
    expect(useBuilderStore.getState().config.app.name).toBe("Zalo Mini App Mẫu");

    useBuilderStore.getState().redo();
    expect(useBuilderStore.getState().config.app.name).toBe("Tên Mới 1");
  });
});
