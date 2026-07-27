"use client";

import React, { useState, useEffect } from "react";
import {
  runComplianceCheck,
  emitMarkdownReport,
  ComplianceIssue,
  MANUAL_CHECKLIST_ITEMS,
} from "@zalo-builder/compliance";
import { useBuilderStore } from "../../store/builder-store";
import {
  ShieldAlert,
  ShieldCheck,
  X,
  FileDown,
  ExternalLink,
  CheckSquare,
  Square,
  Sparkles,
} from "lucide-react";

interface ComplianceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = "all" | "error" | "warning" | "info";

export function ComplianceModal({ isOpen, onClose }: ComplianceModalProps) {
  const config = useBuilderStore((state) => state.config);
  const setActivePage = useBuilderStore((state) => state.setActivePage);
  const selectBlock = useBuilderStore((state) => state.selectBlock);

  const [activeTab, setActiveTab] = useState("all" as TabType);
  const [checkedManualItems, setCheckedManualItems] = useState({} as Record<string, boolean>);

  // Load saved manual checklist state from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("zma_compliance_checklist");
      if (saved) {
        setCheckedManualItems(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
  }, []);

  const toggleManualItem = (id: string) => {
    const updated = { ...checkedManualItems, [id]: !checkedManualItems[id] };
    setCheckedManualItems(updated);
    try {
      localStorage.setItem("zma_compliance_checklist", JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  if (!isOpen) return null;

  const report = runComplianceCheck(config);

  const filteredIssues = report.issues.filter((issue) => {
    if (activeTab === "all") return true;
    return issue.severity === activeTab;
  });

  const handleJumpToIssue = (issue: ComplianceIssue) => {
    if (issue.location?.pageId) {
      setActivePage(issue.location.pageId);
    }
    if (issue.location?.blockId) {
      selectBlock(issue.location.blockId);
    }
    onClose();
  };

  const handleDownloadMarkdown = () => {
    const md = emitMarkdownReport(report, config.app.name);
    const blob = new Blob([md], { type: "text/markdown;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const safeName = (config.app.name || "mini-app")
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-");
    a.download = `compliance-report-${safeName}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div
              className={`p-2.5 rounded-xl ${
                report.passed
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-rose-100 text-rose-700"
              }`}
            >
              {report.passed ? (
                <ShieldCheck className="w-6 h-6" />
              ) : (
                <ShieldAlert className="w-6 h-6" />
              )}
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                Kiểm Duyệt Zalo Mini App
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                    report.passed
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-rose-100 text-rose-800"
                  }`}
                >
                  {report.passed ? "✅ Đạt tiêu chuẩn nộp" : `❌ Cần sửa ${report.errorsCount} lỗi`}
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                Tự động kiểm tra {report.totalIssues} tiêu chí theo Zalo Mini App Review Policy 2026
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownloadMarkdown}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-semibold transition"
              title="Tải báo cáo Markdown gửi Zalo"
            >
              <FileDown className="w-4 h-4" /> Xuất Báo Cáo MD
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter Tabs & Summary */}
        <div className="px-6 py-3 border-b border-slate-100 bg-white flex items-center justify-between gap-2">
          <div className="flex gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-medium text-slate-600">
            <button
              type="button"
              onClick={() => setActiveTab("all")}
              className={`px-3 py-1.5 rounded-lg transition ${
                activeTab === "all"
                  ? "bg-white text-slate-900 font-semibold shadow-sm"
                  : "hover:text-slate-900"
              }`}
            >
              Tất cả ({report.totalIssues})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("error")}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1 transition ${
                activeTab === "error"
                  ? "bg-rose-500 text-white font-semibold shadow-sm"
                  : "text-rose-600 hover:bg-rose-50"
              }`}
            >
              ❌ Sẽ từ chối ({report.errorsCount})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("warning")}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1 transition ${
                activeTab === "warning"
                  ? "bg-amber-500 text-white font-semibold shadow-sm"
                  : "text-amber-700 hover:bg-amber-50"
              }`}
            >
              ⚠️ Rủi ro ({report.warningsCount})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("info")}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1 transition ${
                activeTab === "info"
                  ? "bg-blue-600 text-white font-semibold shadow-sm"
                  : "text-blue-700 hover:bg-blue-50"
              }`}
            >
              ℹ️ Thủ tục ({report.infosCount})
            </button>
          </div>

          <div className="text-xs text-slate-400 font-mono">
            {new Date(report.checkedAt).toLocaleTimeString("vi-VN")}
          </div>
        </div>

        {/* Issue Cards Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
          {filteredIssues.length === 0 ? (
            <div className="py-12 text-center">
              <Sparkles className="w-12 h-12 text-emerald-500 mx-auto mb-3 animate-bounce" />
              <h3 className="text-sm font-bold text-slate-800">Không tìm thấy vấn đề nào!</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Ứng dụng của bạn đã vượt qua tất cả các tiêu chí kiểm tra trong danh mục này.
              </p>
            </div>
          ) : (
            filteredIssues.map((issue, idx) => {
              const isError = issue.severity === "error";
              const isWarning = issue.severity === "warning";

              return (
                <div
                  key={`${issue.ruleCode}-${idx}`}
                  className={`p-4 rounded-xl border transition shadow-sm bg-white ${
                    isError
                      ? "border-rose-200 hover:border-rose-300"
                      : isWarning
                      ? "border-amber-200 hover:border-amber-300"
                      : "border-blue-200 hover:border-blue-300"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div
                        className={`p-2 rounded-lg text-xs font-bold shrink-0 mt-0.5 ${
                          isError
                            ? "bg-rose-100 text-rose-700"
                            : isWarning
                            ? "bg-amber-100 text-amber-800"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {issue.ruleCode}
                      </div>

                      <div>
                        <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                          {issue.ruleTitle}
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                              isError
                                ? "bg-rose-50 text-rose-700 border border-rose-200"
                                : isWarning
                                ? "bg-amber-50 text-amber-700 border border-amber-200"
                                : "bg-blue-50 text-blue-700 border border-blue-200"
                            }`}
                          >
                            {isError
                              ? "❌ Sẽ bị từ chối"
                              : isWarning
                              ? "⚠️ Rủi ro bị từ chối"
                              : "ℹ️ Hồ sơ thủ tục"}
                          </span>
                        </h4>

                        <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                          {issue.message}
                        </p>

                        <div className="mt-2.5 p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs text-slate-700 space-y-1">
                          <div className="flex items-start gap-1.5 font-medium text-emerald-800">
                            <span className="shrink-0">💡 Cách khắc phục:</span>
                            <span>{issue.fix}</span>
                          </div>
                          <div className="text-[11px] text-slate-400">
                            Căn cứ: {issue.source}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Button: Jump to Block location */}
                    {issue.location?.pageId && (
                      <button
                        type="button"
                        onClick={() => handleJumpToIssue(issue)}
                        className="shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 text-xs font-semibold transition"
                        title="Bấm để chuyển tới trang/block này"
                      >
                        Sửa ngay <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}

          {/* Manual Legal Checklist Section */}
          {(activeTab === "all" || activeTab === "info") && (
            <div className="mt-6 pt-4 border-t border-slate-200">
              <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                📋 Danh Mục Tích Tay Xác Nhận Hồ Sơ Thủ Tục (ZMA-009)
              </h3>
              <div className="space-y-2">
                {MANUAL_CHECKLIST_ITEMS.map((item) => {
                  const isChecked = !!checkedManualItems[item.id];
                  return (
                    <div
                      key={item.id}
                      onClick={() => toggleManualItem(item.id)}
                      className={`p-3 rounded-xl border cursor-pointer select-none transition flex items-start gap-3 ${
                        isChecked
                          ? "bg-emerald-50/60 border-emerald-300 text-emerald-950"
                          : "bg-white border-slate-200 hover:border-slate-300 text-slate-700"
                      }`}
                    >
                      <button type="button" className="mt-0.5 text-emerald-600">
                        {isChecked ? (
                          <CheckSquare className="w-5 h-5 text-emerald-600" />
                        ) : (
                          <Square className="w-5 h-5 text-slate-400" />
                        )}
                      </button>
                      <div>
                        <h5
                          className={`text-xs font-bold ${
                            isChecked ? "text-emerald-900 line-through" : "text-slate-800"
                          }`}
                        >
                          {item.title}
                        </h5>
                        <p className="text-[11px] text-slate-500 mt-0.5">{item.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
