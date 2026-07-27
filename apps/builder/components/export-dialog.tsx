"use client";

import React, { useState } from "react";
import { useBuilderStore } from "../store/builder-store";
import { runComplianceCheck } from "@zalo-builder/compliance";
import { runExportFlow } from "../lib/export/export-flow";
import {
  X,
  Download,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  ShieldCheck,
  Loader2,
  FileCode2,
} from "lucide-react";

export interface ExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ExportDialog({ isOpen, onClose }: ExportDialogProps) {
  const config = useBuilderStore((state) => state.config);
  const [isExporting, setIsExporting] = useState(false);
  const [forceExport, setForceExport] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  if (!isOpen) return null;

  const complianceReport = runComplianceCheck(config);
  const hasErrors = complianceReport.errorsCount > 0;

  const handleExport = async () => {
    try {
      setIsExporting(true);
      await runExportFlow(config, { downloadImmediately: true });
      setExportSuccess(true);
      setTimeout(() => {
        setExportSuccess(false);
        onClose();
      }, 2000);
    } catch (err) {
      console.error("Export zip error:", err);
      alert("Rắc rối khi đóng gói zip: " + (err as Error).message);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-slate-800 text-base">Đóng Gói & Xuất Source Code</h2>
              <p className="text-xs text-slate-500">Tải bộ mã nguồn `.zip` chuẩn Zalo Mini App</p>
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

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Summary Box */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileCode2 className="w-8 h-8 text-slate-600" />
              <div>
                <h3 className="font-semibold text-slate-800 text-sm">{config.app.name}</h3>
                <p className="text-xs text-slate-500">
                  {config.pages.length} trang · {config.pages.reduce((acc, p) => acc + p.blocks.length, 0)} blocks
                </p>
              </div>
            </div>
            <span className="text-xs font-mono bg-blue-100 text-blue-700 font-bold px-2.5 py-1 rounded-full">
              .ZIP
            </span>
          </div>

          {/* Compliance Status */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Kết Quả Kiểm Duyệt Zalo Mini App
            </h4>

            {complianceReport.passed ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-xs text-emerald-800">
                  <p className="font-bold">✅ Ứng dụng đạt đủ tiêu chuẩn Zalo!</p>
                  <p className="text-emerald-700 mt-0.5">
                    Không có lỗi nghiêm trọng. Mã nguồn sẵn sàng để nộp lên Zalo Mini App Studio.
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-rose-50 border border-rose-200 rounded-xl p-3.5 space-y-2">
                <div className="flex items-start gap-3">
                  <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  <div className="text-xs text-rose-900">
                    <p className="font-bold">❌ Có {complianceReport.errorsCount} lỗi nghiêm trọng cần sửa!</p>
                    <p className="text-rose-700 mt-0.5">
                      Đóng gói ứng dụng khi chưa đạt kiểm duyệt có thể khiến Zalo từ chối duyệt app.
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-rose-200/60 flex items-center justify-between text-xs font-medium">
                  <span className="text-rose-700">
                    {complianceReport.errorsCount} lỗi · {complianceReport.warningsCount} cảnh báo
                  </span>
                  <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 hover:text-slate-900">
                    <input
                      type="checkbox"
                      checked={forceExport}
                      onChange={(e) => setForceExport(e.target.checked)}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span>Vẫn muốn ép xuất ZIP</span>
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Package details */}
          <div className="text-xs text-slate-500 space-y-1.5 bg-slate-50 p-3 rounded-lg border border-slate-200">
            <p className="font-semibold text-slate-700">File ZIP bao gồm:</p>
            <ul className="list-disc list-inside space-y-1 text-slate-600 pl-1">
              <li>Mã nguồn React Zalo Mini App (thư mục `src/`)</li>
              <li>Cấu hình `app-config.json` & `package.json`</li>
              <li>File `builder.json` (để nhập lại sửa tiếp bất cứ lúc nào)</li>
              <li>Báo cáo kiểm duyệt `COMPLIANCE-REPORT.md`</li>
              <li>Hướng dẫn `README.md` từng bước cài đặt & deploy</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200 transition"
          >
            Hủy
          </button>

          <button
            type="button"
            disabled={isExporting || (hasErrors && !forceExport)}
            onClick={handleExport}
            className={`px-5 py-2 rounded-xl text-xs font-bold text-white flex items-center gap-2 shadow-md transition ${
              isExporting
                ? "bg-slate-400 cursor-not-allowed"
                : exportSuccess
                ? "bg-emerald-600 hover:bg-emerald-700"
                : hasErrors && !forceExport
                ? "bg-slate-300 cursor-not-allowed text-slate-500"
                : "bg-blue-600 hover:bg-blue-700 active:scale-95"
            }`}
          >
            {isExporting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Đang đóng gói...
              </>
            ) : exportSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4" /> Đã Tải ZIP!
              </>
            ) : (
              <>
                <Download className="w-4 h-4" /> Tải File .ZIP Ngay
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
