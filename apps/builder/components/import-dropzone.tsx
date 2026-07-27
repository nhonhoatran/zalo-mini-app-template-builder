"use client";

import React, { useState, useRef } from "react";
import { useBuilderStore } from "../store/builder-store";
import { parseBuilderFile } from "../lib/import/parse-builder-file";
import {
  X,
  UploadCloud,
  FileJson,
  AlertCircle,
  CheckCircle2,
  Loader2,
  FileUp,
} from "lucide-react";

export interface ImportDropzoneProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ImportDropzone({ isOpen, onClose }: ImportDropzoneProps) {
  const loadConfig = useBuilderStore((state) => state.loadConfig);

  const [isDragging, setIsDragging] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [errors, setErrors] = React.useState<string[]>([]);
  const [successInfo, setSuccessInfo] = React.useState<string | null>(null);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileProcess = async (file: File) => {
    setErrors([]);
    setSuccessInfo(null);

    if (!file.name.endsWith(".json") && file.type !== "application/json") {
      setErrors(["Vui lòng chỉ chọn file cấu hình `.json` (chẳng hạn file `builder.json`)."]);
      return;
    }

    setIsLoading(true);

    try {
      const result = await parseBuilderFile(file);
      if (result.success) {
        loadConfig(result.config);
        const msg = result.migrated
          ? `Đã nâng cấp từ v${result.originalVersion} lên v1 & khôi phục dự án "${result.config.app.name}" thành công!`
          : `Đã khôi phục thành công ứng dụng "${result.config.app.name}"!`;
        setSuccessInfo(msg);
        setTimeout(() => {
          setSuccessInfo(null);
          onClose();
        }, 1500);
      } else {
        setErrors(result.errors);
      }
    } catch (err) {
      setErrors(["Không thể đọc file builder.json: " + (err as Error).message]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileProcess(e.target.files[0]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <FileUp className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-slate-800 text-base">Nhập Lại `builder.json`</h2>
              <p className="text-xs text-slate-500">Tải lên file đã xuất để chỉnh sửa tiếp</p>
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

        {/* Body */}
        <div className="p-6 space-y-4">
          {/* Dropzone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition flex flex-col items-center justify-center gap-3 ${
              isDragging
                ? "border-blue-500 bg-blue-50/50"
                : "border-slate-300 hover:border-slate-400 bg-slate-50/50"
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept=".json,application/json"
              className="hidden"
            />

            {isLoading ? (
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                <p className="text-xs font-semibold text-slate-600">Đang đọc & kiểm tra schema...</p>
              </div>
            ) : (
              <>
                <div className="p-3 rounded-full bg-white shadow-sm text-slate-600 border border-slate-200">
                  <UploadCloud className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <p className="font-bold text-sm text-slate-700">
                    Kéo thả file <code className="text-blue-600 bg-blue-50 px-1 py-0.5 rounded">builder.json</code> vào đây
                  </p>
                  <p className="text-xs text-slate-400 mt-1">Hoặc bấm để chọn file từ máy tính</p>
                </div>
              </>
            )}
          </div>

          {/* Success Info */}
          {successInfo && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 flex items-center gap-3 text-xs text-emerald-800 font-medium">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{successInfo}</span>
            </div>
          )}

          {/* Errors */}
          {errors.length > 0 && (
            <div className="bg-rose-50 border border-rose-200 rounded-xl p-3.5 space-y-1 text-xs text-rose-800">
              <div className="flex items-center gap-2 font-bold text-rose-900">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>Không thể nhập file builder.json</span>
              </div>
              <ul className="list-disc list-inside space-y-1 pl-1 text-rose-700">
                {errors.map((err: string, idx: number) => (
                  <li key={idx}>{err}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Helper instructions */}
          <div className="text-[11px] text-slate-400 bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
            <p className="font-semibold text-slate-600">💡 Lưu ý khi nhập lại:</p>
            <p>
              • File `builder.json` nằm trong thư mục gốc của file `.zip` bạn từng xuất ra.
            </p>
            <p>
              • Dữ liệu hiện tại trong builder sẽ được thay thế hoàn toàn bằng dữ liệu file vừa nhập.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
