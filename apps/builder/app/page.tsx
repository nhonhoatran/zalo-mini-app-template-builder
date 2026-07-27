"use client";

import React from "react";
import { BuilderHeader } from "../components/builder-header";
import { BlockPalette } from "../components/block-palette/block-palette";
import { PhoneFrame } from "../components/canvas/phone-frame";
import { InspectorPanel } from "../components/inspector/inspector-panel";

export default function BuilderPage() {
  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-slate-100 font-sans">
      {/* Top Navigation & Controls */}
      <BuilderHeader />

      {/* Main 3-Column Workspace Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Column: Block Library & Search */}
        <BlockPalette />

        {/* Middle Column: Interactive Mobile Frame Preview & DND Canvas */}
        <PhoneFrame />

        {/* Right Column: Dynamic Zod Property Form Inspector */}
        <InspectorPanel />
      </div>
    </div>
  );
}
