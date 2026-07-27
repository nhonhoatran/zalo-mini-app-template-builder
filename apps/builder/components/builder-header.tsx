"use client";

import React, { useState } from "react";
import { useBuilderStore } from "../store/builder-store";
import { runComplianceCheck } from "@zalo-builder/compliance";
import { AppSettingsModal } from "./app-settings-modal";
import { PageManager } from "./page-manager/page-manager";
import { ComplianceModal } from "./compliance/compliance-modal";
import { ExportDialog } from "./export-dialog";
import { ImportDropzone } from "./import-dropzone";
import { StarterPicker } from "./starter-picker";
import {
  Undo2,
  Redo2,
  Download,
  Settings,
  RotateCcw,
  ShieldCheck,
  ShieldAlert,
  LayoutTemplate,
  FileUp,
} from "lucide-react";

export function BuilderHeader() {
  const config = useBuilderStore((state) => state.config);
  const undo = useBuilderStore((state) => state.undo);
  const redo = useBuilderStore((state) => state.redo);
  const canUndo = useBuilderStore((state) => state.canUndo());
  const canRedo = useBuilderStore((state) => state.canRedo());
  const resetToDefault = useBuilderStore((state) => state.resetToDefault);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isComplianceOpen, setIsComplianceOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isStarterOpen, setIsStarterOpen] = useState(false);

  const complianceReport = runComplianceCheck(config);

  return (
    <>
      <header className="h-14 bg-white border-b border-slate-200 px-4 flex items-center justify-between select-none z-30 relative">
        {/* Left: Brand & App Title */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
              Z
            </div>
            <div>
              <h1 className="font-bold text-sm text-slate-800 flex items-center gap-1.5">
                Zalo App Builder
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 border border-blue-200 font-semibold">
                  v1.0 MVP
                </span>
              </h1>
              <p className="text-[10px] text-slate-400">Sinh source code chuẩn Zalo</p>
            </div>
          </div>

          <div className="h-5 w-px bg-slate-200" />

          {/* App Metadata Badge & Edit */}
          <button
            type="button"
            onClick={() => setIsSettingsOpen(true)}
            className="flex items-center gap-2 px-2.5 py-1 rounded-md hover:bg-slate-100 text-xs text-slate-700 transition"
          >
            <span
              className="w-2.5 h-2.5 rounded-full inline-block"
              style={{ backgroundColor: config.app.primaryColor }}
            />
            <span className="font-semibold max-w-[140px] truncate">{config.app.name}</span>
            <Settings className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>

        {/* Center: Page Manager Tabs */}
        <div className="flex-1 max-w-xl mx-4">
          <PageManager />
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Button: Starters Modal */}
          <button
            type="button"
            onClick={() => setIsStarterOpen(true)}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 flex items-center gap-1.5 transition"
            title="Chọn mẫu ứng dụng dựng sẵn"
          >
            <LayoutTemplate className="w-4 h-4 text-blue-600" />
            <span>Mẫu dự án</span>
          </button>

          {/* Button: Import JSON */}
          <button
            type="button"
            onClick={() => setIsImportOpen(true)}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 flex items-center gap-1.5 transition"
            title="Nhập lại file builder.json để chỉnh sửa"
          >
            <FileUp className="w-4 h-4 text-emerald-600" />
            <span>Nhập JSON</span>
          </button>

          {/* Button: Compliance Check / Inspection */}
          <button
            type="button"
            onClick={() => setIsComplianceOpen(true)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition ${
              complianceReport.passed
                ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                : "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100"
            }`}
            title="Kiểm tra các quy định duyệt Zalo Mini App"
          >
            {complianceReport.passed ? (
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            ) : (
              <ShieldAlert className="w-4 h-4 text-rose-600" />
            )}
            <span>Kiểm duyệt</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                complianceReport.passed
                  ? "bg-emerald-200 text-emerald-800"
                  : "bg-rose-200 text-rose-800"
              }`}
            >
              {complianceReport.passed ? "Sạch" : `${complianceReport.errorsCount} lỗi`}
            </span>
          </button>

          {/* Undo / Redo */}
          <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200">
            <button
              type="button"
              disabled={!canUndo}
              onClick={undo}
              className="p-1.5 text-slate-600 hover:text-slate-900 disabled:opacity-30 disabled:hover:text-slate-600 rounded transition"
              title="Hoàn tác (Undo)"
            >
              <Undo2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              disabled={!canRedo}
              onClick={redo}
              className="p-1.5 text-slate-600 hover:text-slate-900 disabled:opacity-30 disabled:hover:text-slate-600 rounded transition"
              title="Làm lại (Redo)"
            >
              <Redo2 className="w-4 h-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => {
              if (confirm("Anh yêu có chắc muốn đặt lại builder về mặc định hông?")) {
                resetToDefault();
              }
            }}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition"
            title="Đặt lại từ đầu"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Button: Open Export Dialog */}
          <button
            type="button"
            onClick={() => setIsExportOpen(true)}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:scale-95 flex items-center gap-2 shadow-sm transition"
          >
            <Download className="w-4 h-4" />
            <span>Xuất File ZIP</span>
          </button>
        </div>
      </header>

      <AppSettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      <ComplianceModal isOpen={isComplianceOpen} onClose={() => setIsComplianceOpen(false)} />
      <ExportDialog isOpen={isExportOpen} onClose={() => setIsExportOpen(false)} />
      <ImportDropzone isOpen={isImportOpen} onClose={() => setIsImportOpen(false)} />
      <StarterPicker isOpen={isStarterOpen} onClose={() => setIsStarterOpen(false)} />
    </>
  );
}

