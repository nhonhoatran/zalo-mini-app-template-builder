"use client";

import React from "react";
import { z } from "zod";

interface SchemaFormProps {
  schema: z.ZodObject<any>;
  values: Record<string, any>;
  onChange: (newValues: Record<string, any>) => void;
}

export function SchemaForm({ schema, values, onChange }: SchemaFormProps) {
  const shape = schema.shape;

  const handleFieldChange = (key: string, value: any) => {
    onChange({
      ...values,
      [key]: value,
    });
  };

  return (
    <div className="space-y-4 text-xs">
      {Object.entries(shape).map(([key, rawTypeDef]) => {
        const value = values[key];
        let typeDef = rawTypeDef as any;

        // Unwrap ZodDefault or ZodOptional
        while (typeDef._def?.typeName === "ZodDefault" || typeDef._def?.typeName === "ZodOptional") {
          typeDef = typeDef._def.innerType;
        }

        const typeName = typeDef._def?.typeName;

        // Field Label
        const label = key
          .replace(/([A-Z])/g, " $1")
          .replace(/^./, (str) => str.toUpperCase());

        // 1. ZodEnum / Select
        if (typeName === "ZodEnum") {
          const options: string[] = typeDef._def.values;
          return (
            <div key={key} className="space-y-1">
              <label className="font-medium text-slate-700 block">{label}</label>
              <select
                value={value ?? options[0]}
                onChange={(e) => handleFieldChange(key, e.target.value)}
                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {options.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          );
        }

        // 2. ZodBoolean / Checkbox
        if (typeName === "ZodBoolean") {
          return (
            <div key={key} className="flex items-center justify-between py-1">
              <label className="font-medium text-slate-700">{label}</label>
              <input
                type="checkbox"
                checked={Boolean(value)}
                onChange={(e) => handleFieldChange(key, e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
              />
            </div>
          );
        }

        // 3. ZodNumber
        if (typeName === "ZodNumber") {
          return (
            <div key={key} className="space-y-1">
              <label className="font-medium text-slate-700 block">{label}</label>
              <input
                type="number"
                value={value ?? 0}
                onChange={(e) => handleFieldChange(key, Number(e.target.value))}
                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          );
        }

        // 4. ZodArray
        if (typeName === "ZodArray") {
          const items: any[] = Array.isArray(value) ? value : [];
          return (
            <div key={key} className="space-y-2 border-t pt-2 border-slate-100">
              <div className="flex items-center justify-between">
                <label className="font-semibold text-slate-800">{label} ({items.length})</label>
                <button
                  type="button"
                  onClick={() => {
                    const newItem = typeof items[0] === "object" ? {} : "";
                    handleFieldChange(key, [...items, newItem]);
                  }}
                  className="px-2 py-0.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded text-[11px] font-medium"
                >
                  + Thêm mục
                </button>
              </div>
              <div className="space-y-2">
                {items.map((item, idx) => (
                  <div key={idx} className="p-2 bg-slate-50 border border-slate-200 rounded-md space-y-2 relative">
                    <div className="flex items-center justify-between text-[11px] font-medium text-slate-500 border-b pb-1">
                      <span># {idx + 1}</span>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = items.filter((_, i) => i !== idx);
                          handleFieldChange(key, updated);
                        }}
                        className="text-red-500 hover:text-red-700"
                      >
                        Xoá
                      </button>
                    </div>
                    {typeof item === "object" && item !== null ? (
                      Object.keys(item).map((itemKey) => (
                        <div key={itemKey} className="space-y-1">
                          <label className="text-[10px] text-slate-500 block capitalize">{itemKey}</label>
                          <input
                            type="text"
                            value={item[itemKey] ?? ""}
                            onChange={(e) => {
                              const updatedItems = [...items];
                              updatedItems[idx] = { ...updatedItems[idx], [itemKey]: e.target.value };
                              handleFieldChange(key, updatedItems);
                            }}
                            className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs"
                          />
                        </div>
                      ))
                    ) : (
                      <input
                        type="text"
                        value={item ?? ""}
                        onChange={(e) => {
                          const updatedItems = [...items];
                          updatedItems[idx] = e.target.value;
                          handleFieldChange(key, updatedItems);
                        }}
                        className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        }

        // 5. Special String Controls (Color, Image, Textarea, Text)
        const isColor = key.toLowerCase().includes("color");
        const isImage = key.toLowerCase().includes("image") || key.toLowerCase().includes("url") || key.toLowerCase().includes("avatar");
        const isLongText = key.toLowerCase().includes("content") || key.toLowerCase().includes("description");

        if (isColor) {
          return (
            <div key={key} className="space-y-1">
              <label className="font-medium text-slate-700 block">{label}</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={value || "#000000"}
                  onChange={(e) => handleFieldChange(key, e.target.value)}
                  className="w-8 h-8 rounded border border-slate-200 cursor-pointer p-0.5"
                />
                <input
                  type="text"
                  value={value ?? ""}
                  onChange={(e) => handleFieldChange(key, e.target.value)}
                  className="flex-1 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-md font-mono uppercase"
                  placeholder="#006AF5"
                />
              </div>
            </div>
          );
        }

        if (isLongText) {
          return (
            <div key={key} className="space-y-1">
              <label className="font-medium text-slate-700 block">{label}</label>
              <textarea
                rows={3}
                value={value ?? ""}
                onChange={(e) => handleFieldChange(key, e.target.value)}
                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 font-sans"
              />
            </div>
          );
        }

        if (isImage) {
          return (
            <div key={key} className="space-y-1">
              <label className="font-medium text-slate-700 block">{label}</label>
              <input
                type="text"
                value={value ?? ""}
                onChange={(e) => handleFieldChange(key, e.target.value)}
                placeholder="https://..."
                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              {value && typeof value === "string" && value.startsWith("http") && (
                <div className="mt-1 w-full h-20 bg-slate-100 rounded border overflow-hidden flex items-center justify-center">
                  <img src={value} alt="Preview" className="h-full object-cover" />
                </div>
              )}
            </div>
          );
        }

        // Standard String Input
        return (
          <div key={key} className="space-y-1">
            <label className="font-medium text-slate-700 block">{label}</label>
            <input
              type="text"
              value={value ?? ""}
              onChange={(e) => handleFieldChange(key, e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        );
      })}
    </div>
  );
}
