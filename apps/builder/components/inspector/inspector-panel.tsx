"use client";

import React from "react";
import { BLOCK_REGISTRY } from "@zalo-builder/blocks";
import { BLOCK_REQUIRED_PERMISSIONS } from "@zalo-builder/schema";
import { useBuilderStore } from "../../store/builder-store";
import { SchemaForm } from "./schema-form";
import { Sliders, Shield, Layers } from "lucide-react";

export function InspectorPanel() {
  const config = useBuilderStore((state) => state.config);
  const activePageId = useBuilderStore((state) => state.activePageId);
  const selectedBlockId = useBuilderStore((state) => state.selectedBlockId);
  const updateBlockProps = useBuilderStore((state) => state.updateBlockProps);

  const activePage = config.pages.find((p) => p.id === activePageId);
  const selectedBlock = activePage?.blocks.find((b) => b.id === selectedBlockId);

  if (!selectedBlock) {
    return (
      <aside className="w-80 bg-white border-l border-slate-200 flex flex-col h-full select-none">
        <div className="p-4 border-b border-slate-100 flex items-center gap-2">
          <Sliders className="w-4 h-4 text-slate-500" />
          <h2 className="text-base font-semibold text-slate-800">Cấu hình thuộc tính</h2>
        </div>
        <div className="flex-1 p-6 text-center flex flex-col items-center justify-center text-slate-400">
          <Layers className="w-10 h-10 mb-2 opacity-50" />
          <p className="text-sm font-medium text-slate-600">Chưa chọn khối nào</p>
          <p className="text-xs text-slate-400 mt-1 max-w-[200px]">
            Nhấp vào bất kỳ khối nào trên màn hình giữa để chỉnh sửa nội dung và kiểu dáng.
          </p>
        </div>
      </aside>
    );
  }

  const manifest = BLOCK_REGISTRY[selectedBlock.type];
  const reqPerms = BLOCK_REQUIRED_PERMISSIONS[selectedBlock.type] || [];

  return (
    <aside className="w-80 bg-white border-l border-slate-200 flex flex-col h-full select-none">
      {/* Inspector Header */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-slate-800">{manifest?.label || selectedBlock.type}</h2>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-mono">
              {selectedBlock.type}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5 font-mono text-[11px]">ID: {selectedBlock.id}</p>
        </div>
      </div>

      {/* Permissions Warning Badge */}
      {reqPerms.length > 0 && (
        <div className="mx-4 mt-3 p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800 flex items-start gap-2">
          <Shield className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold block">Yêu cầu quyền Zalo:</span>
            <span className="text-[11px] text-amber-700">
              Khối này tự động xin quyền: <b>{reqPerms.join(", ")}</b> khi ứng dụng khởi chạy.
            </span>
          </div>
        </div>
      )}

      {/* Dynamic Schema Form */}
      <div className="flex-1 overflow-y-auto p-4">
        {manifest ? (
          <SchemaForm
            schema={manifest.propsSchema as any}
            values={selectedBlock.props || {}}
            onChange={(newProps) => {
              if (activePageId && selectedBlockId) {
                updateBlockProps(activePageId, selectedBlockId, newProps);
              }
            }}
          />
        ) : (
          <div className="text-xs text-red-500">Không tìm thấy schema cho khối này.</div>
        )}
      </div>
    </aside>
  );
}
