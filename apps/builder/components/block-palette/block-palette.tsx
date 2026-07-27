"use client";

import React, { useState } from "react";
import { getAllBlockManifests, BlockManifest } from "@zalo-builder/blocks";
import { BLOCK_REQUIRED_PERMISSIONS, MvpBlockType } from "@zalo-builder/schema";
import { useBuilderStore } from "../../store/builder-store";
import {
  Search,
  Plus,
  Image,
  FileText,
  Grid,
  PhoneCall,
  MapPin,
  ShoppingBag,
  CreditCard,
  ShoppingCart,
  CalendarCheck,
  ListOrdered,
  ShieldCheck,
  Lock,
} from "lucide-react";

const CATEGORY_NAMES: Record<string, string> = {
  chung: "Chung & Hiển thị",
  ban_hang: "Bán hàng & Sản phẩm",
  dich_vu: "Dịch vụ & Đặt chỗ",
  he_thong: "Hệ thống & Bắt buộc",
};

const CATEGORY_ORDER = ["chung", "ban_hang", "dich_vu", "he_thong"];

const ICON_MAP: Record<string, React.ReactNode> = {
  banner: <Image className="w-5 h-5 text-blue-500" />,
  "rich-text": <FileText className="w-5 h-5 text-emerald-500" />,
  "image-gallery": <Grid className="w-5 h-5 text-purple-500" />,
  "contact-info": <PhoneCall className="w-5 h-5 text-amber-500" />,
  "map-location": <MapPin className="w-5 h-5 text-rose-500" />,
  "product-list": <ShoppingBag className="w-5 h-5 text-indigo-500" />,
  "product-detail": <CreditCard className="w-5 h-5 text-cyan-500" />,
  "cart-button": <ShoppingCart className="w-5 h-5 text-orange-500" />,
  "booking-form": <CalendarCheck className="w-5 h-5 text-green-500" />,
  "service-price-list": <ListOrdered className="w-5 h-5 text-teal-500" />,
  "privacy-policy": <ShieldCheck className="w-5 h-5 text-slate-500" />,
  "permission-request": <Lock className="w-5 h-5 text-red-500" />,
};

const PERMISSION_LABELS: Record<string, string> = {
  userInfo: "👤 Thông tin",
  phoneNumber: "📞 Số ĐT",
  location: "📍 Vị trí",
};

export function BlockPalette() {
  const [search, setSearch] = useState("");
  const activePageId = useBuilderStore((state) => state.activePageId);
  const addBlock = useBuilderStore((state) => state.addBlock);

  const allManifests: BlockManifest<any>[] = getAllBlockManifests();

  const filtered = allManifests.filter((m) => {
    const q = search.toLowerCase();
    return (
      m.label.toLowerCase().includes(q) ||
      m.type.toLowerCase().includes(q) ||
      m.category.toLowerCase().includes(q)
    );
  });

  const grouped = CATEGORY_ORDER.reduce((acc, catKey) => {
    acc[catKey] = filtered.filter((m) => m.category === catKey);
    return acc;
  }, {} as Record<string, BlockManifest<any>[]>);

  const handleAdd = (type: MvpBlockType) => {
    if (!activePageId) return;
    addBlock(activePageId, type);
  };

  return (
    <aside className="w-72 bg-white border-r border-slate-200 flex flex-col h-full select-none">
      <div className="p-4 border-b border-slate-100">
        <h2 className="text-base font-semibold text-slate-800 mb-2">Thư viện khối</h2>
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm khối (banner, sp...)"
            className="w-full pl-9 pr-3 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-5">
        {CATEGORY_ORDER.map((catKey) => {
          const items = grouped[catKey] || [];
          if (items.length === 0) return null;

          return (
            <div key={catKey}>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 px-1">
                {CATEGORY_NAMES[catKey] || catKey}
              </h3>
              <div className="space-y-2">
                {items.map((manifest) => {
                  const reqPerms = BLOCK_REQUIRED_PERMISSIONS[manifest.type] || [];
                  return (
                    <div
                      key={manifest.type}
                      onClick={() => handleAdd(manifest.type)}
                      className="group p-3 border border-slate-200 rounded-lg hover:border-blue-500 hover:shadow-sm bg-white cursor-pointer transition flex items-start gap-3 relative"
                    >
                      <div className="p-2 rounded-md bg-slate-50 group-hover:bg-blue-50 transition">
                        {ICON_MAP[manifest.type] || <Grid className="w-5 h-5 text-slate-400" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium text-slate-800 group-hover:text-blue-600 truncate">
                            {manifest.label}
                          </h4>
                          <button
                            type="button"
                            className="p-1 rounded text-slate-400 group-hover:text-blue-600 group-hover:bg-blue-100 transition"
                            title="Thêm khối"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">
                          Mã: <code className="text-[11px] font-mono text-slate-600">{manifest.type}</code>
                        </p>
                        {reqPerms.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {reqPerms.map((p: string) => (
                              <span
                                key={p}
                                className="text-[10px] bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded border border-amber-200"
                              >
                                {PERMISSION_LABELS[p] || p}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center py-8 text-slate-400 text-sm">
            Không tìm thấy khối phù hợp
          </div>
        )}
      </div>
    </aside>
  );
}
