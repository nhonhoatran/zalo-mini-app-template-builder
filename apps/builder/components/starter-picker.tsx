"use client";

import React from "react";
import { useBuilderStore } from "../store/builder-store";
import { STARTER_TEMPLATES, StarterTemplate } from "../lib/starters";
import {
  X,
  Coffee,
  Sparkles,
  ShoppingBag,
  FilePlus2,
  CheckCircle2,
  ArrowRight,
  LayoutTemplate,
} from "lucide-react";

export interface StarterPickerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function StarterPicker({ isOpen, onClose }: StarterPickerProps) {
  const loadConfig = useBuilderStore((state) => state.loadConfig);
  const resetToDefault = useBuilderStore((state) => state.resetToDefault);
  const activeAppId = useBuilderStore((state) => state.config.app.name);

  if (!isOpen) return null;

  const renderIcon = (iconName: string, color: string) => {
    const props = { className: "w-6 h-6", style: { color } };
    switch (iconName) {
      case "Coffee":
        return <Coffee {...props} />;
      case "Sparkles":
        return <Sparkles {...props} />;
      case "ShoppingBag":
        return <ShoppingBag {...props} />;
      default:
        return <LayoutTemplate {...props} />;
    }
  };

  const handleSelectStarter = (starter: StarterTemplate) => {
    loadConfig(starter.config);
    onClose();
  };

  const handleSelectBlank = () => {
    resetToDefault();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <LayoutTemplate className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-slate-800 text-base">Chọn Mẫu Ứng Dụng Dựng Sẵn</h2>
              <p className="text-xs text-slate-500">Khởi đầu nhanh chóng với 3 mẫu ngành hàng phổ biến</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Grid Body */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {STARTER_TEMPLATES.map((starter) => {
              const isCurrent = activeAppId === starter.config.app.name;
              return (
                <div
                  key={starter.id}
                  onClick={() => handleSelectStarter(starter)}
                  className={`group relative rounded-2xl p-5 border cursor-pointer transition-all flex flex-col justify-between hover:shadow-md ${
                    isCurrent
                      ? "bg-blue-50/40 border-blue-400 ring-2 ring-blue-500/20"
                      : "bg-white border-slate-200 hover:border-blue-400 hover:bg-slate-50/50"
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div
                        className="p-3 rounded-xl shadow-xs"
                        style={{ backgroundColor: `${starter.color}15` }}
                      >
                        {renderIcon(starter.icon, starter.color)}
                      </div>
                      {isCurrent && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-600 text-white flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Đang chọn
                        </span>
                      )}
                    </div>

                    <div>
                      <span
                        className="text-[10px] font-bold uppercase tracking-wider block mb-0.5"
                        style={{ color: starter.color }}
                      >
                        {starter.category}
                      </span>
                      <h3 className="font-bold text-slate-800 text-sm group-hover:text-blue-600 transition">
                        {starter.name}
                      </h3>
                    </div>

                    <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                      {starter.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {starter.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-600 group-hover:translate-x-0.5 transition">
                    <span>Sử dụng mẫu này</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Blank starter option */}
          <div
            onClick={handleSelectBlank}
            className="border border-dashed border-slate-300 hover:border-blue-400 hover:bg-blue-50/30 rounded-xl p-4 flex items-center justify-between cursor-pointer transition group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-slate-100 text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-600 transition">
                <FilePlus2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-xs text-slate-700 group-hover:text-blue-600">
                  Tạo Dự Án Trống
                </h4>
                <p className="text-[11px] text-slate-400">
                  Bắt đầu với ứng dụng Zalo Mini App mặc định chưa có dữ liệu mẫu
                </p>
              </div>
            </div>
            <span className="text-xs font-semibold text-slate-500 group-hover:text-blue-600 flex items-center gap-1">
              Bắt đầu <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
