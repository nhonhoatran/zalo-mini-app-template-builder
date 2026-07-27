"use client";

import React, { useState } from "react";
import { useBuilderStore } from "../../store/builder-store";
import { Plus, Trash2, Layout, Check, X } from "lucide-react";

export function PageManager() {
  const config = useBuilderStore((state) => state.config);
  const activePageId = useBuilderStore((state) => state.activePageId);
  const setActivePage = useBuilderStore((state) => state.setActivePage);
  const addPage = useBuilderStore((state) => state.addPage);
  const removePage = useBuilderStore((state) => state.removePage);
  const updatePage = useBuilderStore((state) => state.updatePage);

  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newPath, setNewPath] = useState("");
  const [showInTabBar, setShowInTabBar] = useState(false);

  const handleCreatePage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newPath.trim()) return;
    addPage(newTitle.trim(), newPath.trim(), showInTabBar);
    setNewTitle("");
    setNewPath("");
    setShowInTabBar(false);
    setIsAdding(false);
  };

  return (
    <div className="flex items-center gap-1 overflow-x-auto py-1 px-2 select-none">
      {config.pages.map((page) => {
        const isActive = page.id === activePageId;
        return (
          <div
            key={page.id}
            onClick={() => setActivePage(page.id)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition border ${
              isActive
                ? "bg-blue-50 border-blue-200 text-blue-700 shadow-sm"
                : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Layout className="w-3.5 h-3.5" />
            <span>{page.title}</span>
            <span className="text-[10px] opacity-60 font-mono">({page.path})</span>

            {config.pages.length > 1 && page.path !== "/" && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removePage(page.id);
                }}
                className="p-0.5 hover:text-red-600 rounded"
                title="Xoá trang"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            )}
          </div>
        );
      })}

      {isAdding ? (
        <form onSubmit={handleCreatePage} className="flex items-center gap-2 bg-white p-1 rounded-lg border border-blue-400 shadow-sm">
          <input
            type="text"
            placeholder="Tên trang"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="px-2 py-1 text-xs bg-slate-50 border rounded w-24 focus:outline-none"
            autoFocus
          />
          <input
            type="text"
            placeholder="/path"
            value={newPath}
            onChange={(e) => setNewPath(e.target.value)}
            className="px-2 py-1 text-xs bg-slate-50 border rounded w-20 focus:outline-none"
          />
          <label className="flex items-center gap-1 text-[11px] text-slate-600 cursor-pointer">
            <input
              type="checkbox"
              checked={showInTabBar}
              onChange={(e) => setShowInTabBar(e.target.checked)}
              className="rounded"
            />
            Tab
          </label>
          <button type="submit" className="p-1 bg-blue-600 text-white rounded hover:bg-blue-700">
            <Check className="w-3.5 h-3.5" />
          </button>
          <button type="button" onClick={() => setIsAdding(false)} className="p-1 bg-slate-200 text-slate-600 rounded hover:bg-slate-300">
            <X className="w-3.5 h-3.5" />
          </button>
        </form>
      ) : (
        <button
          type="button"
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-100 text-slate-600 hover:bg-slate-200 transition"
        >
          <Plus className="w-3.5 h-3.5" /> Trang mới
        </button>
      )}
    </div>
  );
}
