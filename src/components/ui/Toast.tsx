"use client";

import React from "react";
import { useAegisFlow } from "@/context/AegisFlowContext";
import { AlertCircle, CheckCircle2, Info, AlertTriangle, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function ToastContainer() {
  const { toasts, dismissToast } = useAegisFlow();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col space-y-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const icon = {
          info: <Info className="w-4 h-4 text-ops-cyan shrink-0" />,
          success: <CheckCircle2 className="w-4 h-4 text-ops-emerald shrink-0" />,
          warning: <AlertTriangle className="w-4 h-4 text-ops-amber shrink-0" />,
          error: <AlertCircle className="w-4 h-4 text-ops-crimson shrink-0" />,
        }[toast.type];

        const borderStyle = {
          info: "border-ops-cyan/40 bg-surface",
          success: "border-ops-emerald/40 bg-surface",
          warning: "border-ops-amber/40 bg-surface",
          error: "border-ops-crimson/40 bg-surface",
        }[toast.type];

        return (
          <div
            key={toast.id}
            className={cn(
              "pointer-events-auto flex items-start gap-3 p-3.5 rounded border shadow-ops-lg transition-all transform translate-y-0",
              borderStyle
            )}
          >
            {icon}
            <div className="flex-1">
              <h4 className="text-xs font-semibold text-text-primary font-mono uppercase tracking-wider">
                {toast.title}
              </h4>
              {toast.message && (
                <p className="text-xs text-text-secondary mt-0.5 leading-snug">
                  {toast.message}
                </p>
              )}
            </div>
            <button
              onClick={() => dismissToast(toast.id)}
              className="text-text-muted hover:text-text-primary p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
