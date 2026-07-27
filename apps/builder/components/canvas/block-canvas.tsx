"use client";

import React from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { BLOCK_REGISTRY, BLOCK_COMPONENTS } from "@zalo-builder/blocks";
import { useBuilderStore } from "../../store/builder-store";
import { SortableBlockWrapper } from "./sortable-block-wrapper";
import { Layers } from "lucide-react";

interface BlockCanvasProps {
  isDarkMode?: boolean;
}

export function BlockCanvas({ isDarkMode }: BlockCanvasProps) {
  const config = useBuilderStore((state) => state.config);
  const activePageId = useBuilderStore((state) => state.activePageId);
  const reorderBlocks = useBuilderStore((state) => state.reorderBlocks);
  const selectBlock = useBuilderStore((state) => state.selectBlock);

  const activePage = config.pages.find((p) => p.id === activePageId);
  const blocks = activePage?.blocks || [];

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id && activePageId) {
      reorderBlocks(activePageId, String(active.id), String(over.id));
    }
  };

  if (!activePage || blocks.length === 0) {
    return (
      <div
        onClick={() => selectBlock(null)}
        className="h-full min-h-[400px] flex flex-col items-center justify-center p-6 text-center border-2 border-dashed border-slate-300 rounded-xl bg-slate-50/50 my-4 cursor-pointer"
      >
        <Layers className="w-10 h-10 text-slate-400 mb-2" />
        <h3 className="text-sm font-semibold text-slate-700">Trang chưa có khối nào</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-[220px]">
          Chọn hoặc kéo khối từ thư viện bên trái vào đây để bắt đầu thiết kế.
        </p>
      </div>
    );
  }

  return (
    <div
      onClick={() => selectBlock(null)}
      className="min-h-full space-y-3 pb-8 cursor-default"
    >
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={blocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
          {blocks.map((block, index) => {
            const manifest = BLOCK_REGISTRY[block.type];
            const Component = BLOCK_COMPONENTS[block.type];

            if (!manifest || !Component) {
              return (
                <div key={block.id} className="p-3 bg-red-50 text-red-600 text-xs rounded border border-red-200">
                  Không tìm thấy khối {block.type}
                </div>
              );
            }

            return (
              <SortableBlockWrapper
                key={block.id}
                id={block.id}
                pageId={activePage.id}
                index={index}
                totalBlocks={blocks.length}
                title={manifest.label}
              >
                <Component {...block.props} />
              </SortableBlockWrapper>
            );
          })}
        </SortableContext>
      </DndContext>
    </div>
  );
}
