"use client";

import React from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { SimulationBar } from "@/components/layout/SimulationBar";
import { MobileNavDrawer } from "@/components/layout/MobileNavDrawer";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { ToastContainer } from "@/components/ui/Toast";
import { GuidedDemoWalkthrough } from "@/components/demo/GuidedDemoWalkthrough";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-text-primary flex overflow-x-hidden">
      {/* Persistent Left Sidebar - Desktop only (hidden on <lg) */}
      <Sidebar />

      {/* Mobile Drawer Navigation (lg:hidden) */}
      <MobileNavDrawer />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-16 lg:pb-0 overflow-x-hidden">
        <TopBar />
        <SimulationBar />
        <main className="flex-1 p-3 sm:p-4 md:p-6 overflow-y-auto max-w-[1600px] w-full mx-auto overflow-x-hidden">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar (lg:hidden) */}
      <MobileBottomNav />

      {/* Floating Tactical Toast Notification Layer */}
      <ToastContainer />

      {/* 5-Min Guided Demo Overlay */}
      <GuidedDemoWalkthrough />
    </div>
  );
}
