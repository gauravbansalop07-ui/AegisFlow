"use client";

import React from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { SimulationBar } from "@/components/layout/SimulationBar";
import { ToastContainer } from "@/components/ui/Toast";
import { GuidedDemoWalkthrough } from "@/components/demo/GuidedDemoWalkthrough";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-text-primary flex">
      {/* Persistent Left Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar />
        <SimulationBar />
        <main className="flex-1 p-6 overflow-y-auto max-w-[1600px] w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Floating Tactical Toast Notification Layer */}
      <ToastContainer />

      {/* 5-Min Guided Demo Overlay */}
      <GuidedDemoWalkthrough />
    </div>
  );
}
