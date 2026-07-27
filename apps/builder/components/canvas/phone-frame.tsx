"use client";

import React, { useState } from "react";
import { useBuilderStore } from "../../store/builder-store";
import { Sun, Moon, Wifi, Battery, Signal, MoreVertical, ChevronLeft, Home, Grid, ShoppingBag } from "lucide-react";
import { BlockCanvas } from "./block-canvas";

export function PhoneFrame() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const config = useBuilderStore((state) => state.config);
  const activePageId = useBuilderStore((state) => state.activePageId);
  const setActivePage = useBuilderStore((state) => state.setActivePage);

  const activePage = config.pages.find((p) => p.id === activePageId) || config.pages[0];
  const tabBarPages = config.pages.filter((p) => p.showInTabBar);

  return (
    <main className="flex-1 bg-slate-100 flex flex-col items-center justify-center p-6 overflow-y-auto select-none relative">
      {/* Top Bar Controls */}
      <div className="mb-4 flex items-center gap-3 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm text-xs text-slate-600">
        <span className="font-medium">Xem trước khung di động</span>
        <div className="h-4 w-px bg-slate-200" />
        <button
          type="button"
          onClick={() => setIsDarkMode(!isDarkMode)}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition ${
            isDarkMode ? "bg-slate-800 text-amber-300" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          {isDarkMode ? (
            <>
              <Moon className="w-3.5 h-3.5" /> Nền tối (Dark)
            </>
          ) : (
            <>
              <Sun className="w-3.5 h-3.5 text-amber-500" /> Nền sáng (Light)
            </>
          )}
        </button>
      </div>

      {/* Phone Hardware Mock Container */}
      <div
        className={`w-[380px] h-[750px] rounded-[48px] border-[10px] border-slate-800 shadow-2xl flex flex-col overflow-hidden relative transition-colors duration-200 ${
          isDarkMode ? "bg-slate-900 text-white" : "bg-slate-50 text-slate-900"
        }`}
      >
        {/* Phone Speaker Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-36 h-5 bg-slate-800 rounded-b-2xl z-50 flex items-center justify-center">
          <div className="w-12 h-1 bg-slate-700 rounded-full" />
        </div>

        {/* Status Bar */}
        <div
          className={`pt-6 px-6 pb-2 flex items-center justify-between text-xs font-semibold z-40 ${
            isDarkMode ? "text-slate-200" : "text-slate-700"
          }`}
        >
          <span>09:41</span>
          <div className="flex items-center gap-1.5">
            <Signal className="w-3.5 h-3.5" />
            <Wifi className="w-3.5 h-3.5" />
            <Battery className="w-4 h-4" />
          </div>
        </div>

        {/* Zalo Header Bar */}
        <div
          className="px-4 py-3 flex items-center justify-between border-b border-slate-200/40 z-40 transition-colors"
          style={{
            backgroundColor: config.app.primaryColor || "#006af5",
            color: "#ffffff",
          }}
        >
          <div className="flex items-center gap-2">
            <ChevronLeft className="w-5 h-5 cursor-pointer opacity-90 hover:opacity-100" />
            <h1 className="font-semibold text-sm truncate max-w-[180px]">
              {activePage?.title || config.app.name}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <MoreVertical className="w-5 h-5 cursor-pointer opacity-90 hover:opacity-100" />
          </div>
        </div>

        {/* Scrollable Page Body (Canvas) */}
        <div className="flex-1 overflow-y-auto p-2 scrollbar-none relative">
          <BlockCanvas isDarkMode={isDarkMode} />
        </div>

        {/* Tab Bar Mock (if enabled) */}
        {tabBarPages.length > 0 && (
          <div
            className={`border-t flex items-center justify-around py-2 px-1 z-40 ${
              isDarkMode
                ? "bg-slate-900 border-slate-800 text-slate-400"
                : "bg-white border-slate-200 text-slate-500"
            }`}
          >
            {tabBarPages.map((page) => {
              const isActive = page.id === activePageId;
              return (
                <button
                  key={page.id}
                  type="button"
                  onClick={() => setActivePage(page.id)}
                  className={`flex flex-col items-center gap-1 text-[11px] font-medium transition ${
                    isActive
                      ? "text-blue-600 font-bold"
                      : "hover:text-slate-800"
                  }`}
                >
                  <Grid className={`w-5 h-5 ${isActive ? "text-blue-600" : ""}`} />
                  <span className="truncate max-w-[64px]">{page.title}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
