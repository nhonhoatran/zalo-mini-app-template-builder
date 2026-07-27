"use client";

import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { useBuilderStore } from "../../store/builder-store";

interface SortableBlockWrapperProps {
  id: string;
  pageId: string;
  index: number;
  totalBlocks: number;
  title: string;
  children: React.ReactNode;
}

export function SortableBlockWrapper({
  id,
  pageId,
  index,
  totalBlocks,
  title,
  children,
}: SortableBlockWrapperProps) {
  const selectedBlockId = useBuilderStore((state) => state.selectedBlockId);
  const selectBlock = useBuilderStore((state) => state.selectBlock);
  const removeBlock = useBuilderStore((state) => state.removeBlock);
  const moveBlockIndex = useBuilderStore((state) => state.moveBlockIndex);

  const isSelected = selectedBlockId === id;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={(e) => {
        e.stopPropagation();
        selectBlock(id);
      }}
      className={`group relative transition rounded-lg border-2 ${
        isSelected
          ? "border-blue-500 shadow-md ring-2 ring-blue-100 z-10"
          : "border-transparent hover:border-slate-300"
      }`}
    >
      {/* Control bar overlay on hover/select */}
      <div
        className={`absolute -top-3 left-2 right-2 flex items-center justify-between px-2 py-0.5 rounded bg-slate-800 text-white text-[11px] font-medium shadow transition opacity-0 group-hover:opacity-100 ${
          isSelected ? "opacity-100" : ""
        } z-20 pointer-events-auto`}
      >
        <div className="flex items-center gap-1">
          <button
            type="button"
            {...attributes}
            {...listeners}
            className="p-0.5 hover:bg-slate-700 rounded cursor-grab active:cursor-grabbing"
            title="Kéo để đổi thứ tự"
          >
            <GripVertical className="w-3.5 h-3.5" />
          </button>
          <span className="truncate max-w-[120px] text-slate-200">{title}</span>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={index === 0}
            onClick={(e) => {
              e.stopPropagation();
              moveBlockIndex(pageId, index, index - 1);
            }}
            className="p-0.5 hover:bg-slate-700 disabled:opacity-30 rounded"
            title="Di chuyển lên"
          >
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            disabled={index === totalBlocks - 1}
            onClick={(e) => {
              e.stopPropagation();
              moveBlockIndex(pageId, index, index + 1);
            }}
            className="p-0.5 hover:bg-slate-700 disabled:opacity-30 rounded"
            title="Di chuyển xuống"
          >
            <ArrowDown className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              removeBlock(pageId, id);
            }}
            className="p-0.5 hover:bg-red-600 text-red-200 hover:text-white rounded ml-1"
            title="Xoá khối"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Actual Block Component Render */}
      <div className="pointer-events-auto select-none overflow-hidden rounded-md">
        {children}
      </div>
    </div>
  );
}
