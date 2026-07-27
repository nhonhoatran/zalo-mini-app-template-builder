"use client";

import React, { useState } from "react";
import { useBuilderStore } from "../store/builder-store";
import { X, Settings, Check } from "lucide-react";

interface AppSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AppSettingsModal({ isOpen, onClose }: AppSettingsModalProps) {
  const config = useBuilderStore((state) => state.config);
  const setAppMeta = useBuilderStore((state) => state.setAppMeta);

  const [name, setName] = useState(config.app.name);
  const [description, setDescription] = useState(config.app.description || "");
  const [primaryColor, setPrimaryColor] = useState(config.app.primaryColor || "#006af5");
  const [oaId, setOaId] = useState(config.app.oaId || "");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAppMeta({
      name: name.trim(),
      description: description.trim(),
      primaryColor,
      oaId: oaId.trim(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-blue-600" />
            <h2 className="font-semibold text-slate-800 text-sm">Cài đặt Zalo Mini App</h2>
          </div>
          <button type="button" onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-medium text-slate-700 block">Tên ứng dụng</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="VD: Cửa Hàng Hoa Tươi"
              required
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-800 text-xs"
            />
          </div>

          <div className="space-y-1">
            <label className="font-medium text-slate-700 block">Mô tả ngắn</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Mô tả ứng dụng Zalo Mini App của bạn..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-800 text-xs"
            />
          </div>

          <div className="space-y-1">
            <label className="font-medium text-slate-700 block">Màu chủ đạo (Primary Color)</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="w-9 h-9 rounded border border-slate-200 cursor-pointer p-0.5"
              />
              <input
                type="text"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-md font-mono uppercase text-xs"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-medium text-slate-700 block">Zalo OA ID (Tùy chọn)</label>
            <input
              type="text"
              value={oaId}
              onChange={(e) => setOaId(e.target.value)}
              placeholder="VD: 123456789012345"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-800 text-xs font-mono"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-medium flex items-center gap-1.5 shadow-sm"
            >
              <Check className="w-4 h-4" /> Lưu cài đặt
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
