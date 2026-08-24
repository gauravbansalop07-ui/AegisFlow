import React, { useEffect } from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  width?: "sm" | "md" | "lg" | "xl";
}

export function Drawer({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  width = "md",
}: DrawerProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const widthStyles = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="fixed inset-0 bg-background/70 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />
      <div className="fixed inset-y-0 right-0 flex pl-0 sm:pl-10 max-w-full">
        <div
          className={cn(
            "w-screen bg-surface border-l border-border-strong p-4 sm:p-6 shadow-2xl flex flex-col justify-between overflow-y-auto max-w-full",
            widthStyles[width]
          )}
        >
          <div>
            <div className="flex items-start justify-between pb-3 sm:pb-4 border-b border-border gap-2">
              <div>
                <h2 className="text-sm sm:text-base font-semibold text-text-primary font-mono uppercase tracking-wider">
                  {title}
                </h2>
                {subtitle && (
                  <p className="text-[11px] sm:text-xs text-text-secondary mt-1">{subtitle}</p>
                )}
              </div>
              <button
                onClick={onClose}
                className="text-text-muted hover:text-text-primary transition-colors p-1.5 rounded hover:bg-surface-elevated shrink-0"
                aria-label="Close panel"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="mt-3 sm:mt-4">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
