import { create } from "zustand";
import {
  BuilderConfig,
  PageConfig,
  BlockConfig,
  AppMeta,
  MvpBlockType,
  derivePermissions,
  parseAndValidateBuilderConfig,
} from "@zalo-builder/schema";
import { getBlockManifest } from "@zalo-builder/blocks";

export const DEFAULT_BUILDER_CONFIG: BuilderConfig = {
  version: 1,
  app: {
    name: "Zalo Mini App Mẫu",
    description: "Ứng dụng Zalo Mini App được tạo bởi Template Builder",
    primaryColor: "#006af5",
    oaId: "",
    locale: "vi",
  },
  pages: [
    {
      id: "page-home",
      title: "Trang chủ",
      path: "/",
      showInTabBar: true,
      icon: "zi-home",
      blocks: [
        {
          id: "block-banner-1",
          type: "banner",
          props: {
            title: "Chào mừng đến với cửa hàng!",
            imageUrl: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800",
            autoPlay: true,
            height: "medium",
          },
        },
        {
          id: "block-rich-text-1",
          type: "rich-text",
          props: {
            content: "### Giới thiệu dịch vụ\nChào mừng anh chị đến với cửa hàng của chúng tôi!",
            align: "left",
          },
        },
        {
          id: "block-contact-info-1",
          type: "contact-info",
          props: {
            phone: "0901234567",
            email: "contact@store.vn",
            address: "123 Đường Nguyễn Huệ, Q.1, TP.HCM",
            workingHours: "08:00 - 21:00 hàng ngày",
          },
        },
      ],
    },
  ],
  permissions: [],
  generated: {
    at: new Date().toISOString(),
    builderVersion: "1.0.0",
  },
};

// Compute permissions initially
DEFAULT_BUILDER_CONFIG.permissions = derivePermissions(DEFAULT_BUILDER_CONFIG.pages);

export interface BuilderState {
  config: BuilderConfig;
  activePageId: string;
  selectedBlockId: string | null;
  history: {
    past: BuilderConfig[];
    future: BuilderConfig[];
  };

  // Actions
  setActivePage: (pageId: string) => void;
  selectBlock: (blockId: string | null) => void;
  setAppMeta: (meta: Partial<AppMeta>) => void;
  
  addPage: (title: string, path: string, showInTabBar?: boolean, icon?: string) => string;
  removePage: (pageId: string) => void;
  updatePage: (pageId: string, updates: Partial<Omit<PageConfig, "id" | "blocks">>) => void;
  
  addBlock: (pageId: string, blockType: MvpBlockType, targetIndex?: number, initialProps?: Record<string, unknown>) => string;
  removeBlock: (pageId: string, blockId: string) => void;
  reorderBlocks: (pageId: string, activeId: string, overId: string) => void;
  moveBlockIndex: (pageId: string, fromIndex: number, toIndex: number) => void;
  updateBlockProps: (pageId: string, blockId: string, newProps: Record<string, unknown>) => void;

  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  
  loadConfig: (config: BuilderConfig) => void;
  resetToDefault: () => void;
}

const MAX_HISTORY = 30;

function pushHistory(state: { config: BuilderConfig; history: { past: BuilderConfig[]; future: BuilderConfig[] } }): {
  past: BuilderConfig[];
  future: BuilderConfig[];
} {
  const newPast = [...state.history.past, state.config].slice(-MAX_HISTORY);
  return {
    past: newPast,
    future: [],
  };
}

export const useBuilderStore = create<BuilderState>((set, get) => ({
  config: DEFAULT_BUILDER_CONFIG,
  activePageId: DEFAULT_BUILDER_CONFIG.pages[0]?.id || "page-home",
  selectedBlockId: null,
  history: {
    past: [],
    future: [],
  },

  setActivePage: (pageId) => {
    set({ activePageId: pageId, selectedBlockId: null });
  },

  selectBlock: (blockId) => {
    set({ selectedBlockId: blockId });
  },

  setAppMeta: (meta) => {
    const { config } = get();
    const updatedConfig: BuilderConfig = {
      ...config,
      app: {
        ...config.app,
        ...meta,
      },
    };
    set((state) => ({
      config: updatedConfig,
      history: pushHistory(state),
    }));
  },

  addPage: (title, path, showInTabBar = false, icon = "zi-home") => {
    const { config } = get();
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    const newPageId = `page-${Date.now()}`;
    const newPage: PageConfig = {
      id: newPageId,
      title,
      path: cleanPath,
      showInTabBar,
      icon,
      blocks: [],
    };

    const newPages = [...config.pages, newPage];
    const updatedConfig: BuilderConfig = {
      ...config,
      pages: newPages,
      permissions: derivePermissions(newPages),
    };

    set((state) => ({
      config: updatedConfig,
      activePageId: newPageId,
      selectedBlockId: null,
      history: pushHistory(state),
    }));

    return newPageId;
  },

  removePage: (pageId) => {
    const { config, activePageId } = get();
    if (config.pages.length <= 1) return; // Cannot delete last page

    const newPages = config.pages.filter((p) => p.id !== pageId);
    // Ensure root '/' page still exists
    if (!newPages.some((p) => p.path === "/")) return;

    const updatedConfig: BuilderConfig = {
      ...config,
      pages: newPages,
      permissions: derivePermissions(newPages),
    };

    const nextActivePageId = activePageId === pageId ? newPages[0].id : activePageId;

    set((state) => ({
      config: updatedConfig,
      activePageId: nextActivePageId,
      selectedBlockId: null,
      history: pushHistory(state),
    }));
  },

  updatePage: (pageId, updates) => {
    const { config } = get();
    const newPages = config.pages.map((p) => {
      if (p.id !== pageId) return p;
      return {
        ...p,
        ...updates,
      };
    });

    const updatedConfig: BuilderConfig = {
      ...config,
      pages: newPages,
      permissions: derivePermissions(newPages),
    };

    set((state) => ({
      config: updatedConfig,
      history: pushHistory(state),
    }));
  },

  addBlock: (pageId, blockType, targetIndex, initialProps) => {
    const { config } = get();
    const manifest = getBlockManifest(blockType);
    const newBlockId = `block-${blockType}-${Date.now()}`;

    let defaultPropsFromManifest: Record<string, unknown> = {};
    if (manifest) {
      const parsed = manifest.propsSchema.safeParse({});
      defaultPropsFromManifest = parsed.success ? (parsed.data as Record<string, unknown>) : { ...(manifest.defaultProps as Record<string, unknown>) };
    }

    const newBlock: BlockConfig = {
      id: newBlockId,
      type: blockType,
      props: {
        ...defaultPropsFromManifest,
        ...initialProps,
      },
    };

    const newPages = config.pages.map((page) => {
      if (page.id !== pageId) return page;
      const updatedBlocks = [...page.blocks];
      if (typeof targetIndex === "number" && targetIndex >= 0 && targetIndex <= updatedBlocks.length) {
        updatedBlocks.splice(targetIndex, 0, newBlock);
      } else {
        updatedBlocks.push(newBlock);
      }
      return {
        ...page,
        blocks: updatedBlocks,
      };
    });

    const updatedConfig: BuilderConfig = {
      ...config,
      pages: newPages,
      permissions: derivePermissions(newPages),
    };

    set((state) => ({
      config: updatedConfig,
      selectedBlockId: newBlockId,
      history: pushHistory(state),
    }));

    return newBlockId;
  },

  removeBlock: (pageId, blockId) => {
    const { config, selectedBlockId } = get();
    const newPages = config.pages.map((page) => {
      if (page.id !== pageId) return page;
      return {
        ...page,
        blocks: page.blocks.filter((b) => b.id !== blockId),
      };
    });

    const updatedConfig: BuilderConfig = {
      ...config,
      pages: newPages,
      permissions: derivePermissions(newPages),
    };

    set((state) => ({
      config: updatedConfig,
      selectedBlockId: selectedBlockId === blockId ? null : selectedBlockId,
      history: pushHistory(state),
    }));
  },

  reorderBlocks: (pageId, activeId, overId) => {
    const { config } = get();
    const page = config.pages.find((p) => p.id === pageId);
    if (!page) return;

    const oldIndex = page.blocks.findIndex((b) => b.id === activeId);
    const newIndex = page.blocks.findIndex((b) => b.id === overId);
    if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) return;

    const updatedBlocks = [...page.blocks];
    const [moved] = updatedBlocks.splice(oldIndex, 1);
    updatedBlocks.splice(newIndex, 0, moved);

    const newPages = config.pages.map((p) => (p.id === pageId ? { ...p, blocks: updatedBlocks } : p));

    const updatedConfig: BuilderConfig = {
      ...config,
      pages: newPages,
      permissions: derivePermissions(newPages),
    };

    set((state) => ({
      config: updatedConfig,
      history: pushHistory(state),
    }));
  },

  moveBlockIndex: (pageId, fromIndex, toIndex) => {
    const { config } = get();
    const page = config.pages.find((p) => p.id === pageId);
    if (!page) return;
    if (fromIndex < 0 || fromIndex >= page.blocks.length) return;
    if (toIndex < 0 || toIndex >= page.blocks.length) return;

    const updatedBlocks = [...page.blocks];
    const [moved] = updatedBlocks.splice(fromIndex, 1);
    updatedBlocks.splice(toIndex, 0, moved);

    const newPages = config.pages.map((p) => (p.id === pageId ? { ...p, blocks: updatedBlocks } : p));

    const updatedConfig: BuilderConfig = {
      ...config,
      pages: newPages,
      permissions: derivePermissions(newPages),
    };

    set((state) => ({
      config: updatedConfig,
      history: pushHistory(state),
    }));
  },

  updateBlockProps: (pageId, blockId, newProps) => {
    const { config } = get();
    const newPages = config.pages.map((page) => {
      if (page.id !== pageId) return page;
      return {
        ...page,
        blocks: page.blocks.map((b) => {
          if (b.id !== blockId) return b;
          return {
            ...b,
            props: {
              ...b.props,
              ...newProps,
            },
          };
        }),
      };
    });

    const updatedConfig: BuilderConfig = {
      ...config,
      pages: newPages,
      permissions: derivePermissions(newPages),
    };

    set((state) => ({
      config: updatedConfig,
      history: pushHistory(state),
    }));
  },

  undo: () => {
    const { history, config } = get();
    if (history.past.length === 0) return;

    const previous = history.past[history.past.length - 1];
    const newPast = history.past.slice(0, history.past.length - 1);

    set({
      config: previous,
      history: {
        past: newPast,
        future: [config, ...history.future],
      },
    });
  },

  redo: () => {
    const { history, config } = get();
    if (history.future.length === 0) return;

    const next = history.future[0];
    const newFuture = history.future.slice(1);

    set({
      config: next,
      history: {
        past: [...history.past, config],
        future: newFuture,
      },
    });
  },

  canUndo: () => get().history.past.length > 0,
  canRedo: () => get().history.future.length > 0,

  loadConfig: (raw) => {
    const validated = parseAndValidateBuilderConfig(raw);
    set({
      config: validated,
      activePageId: validated.pages[0]?.id || "page-home",
      selectedBlockId: null,
      history: { past: [], future: [] },
    });
  },

  resetToDefault: () => {
    set({
      config: DEFAULT_BUILDER_CONFIG,
      activePageId: DEFAULT_BUILDER_CONFIG.pages[0]?.id || "page-home",
      selectedBlockId: null,
      history: { past: [], future: [] },
    });
  },
}));
