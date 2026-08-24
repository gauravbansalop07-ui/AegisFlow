import React from "react";
import { cn } from "@/lib/utils";

interface SliderProps {
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (value: number) => void;
  className?: string;
  label?: string;
  displayValue?: string;
  disabled?: boolean;
}

export function Slider({
  value,
  min = 0,
  max = 100,
  step = 1,
  onChange,
  className,
  label,
  displayValue,
  disabled = false,
}: SliderProps) {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className={cn("flex flex-col space-y-1.5 w-full", className)}>
      {(label || displayValue) && (
        <div className="flex justify-between items-center text-xs font-mono">
          {label && <span className="text-text-secondary">{label}</span>}
          {displayValue && (
            <span className="text-ops-cyan font-bold">{displayValue}</span>
          )}
        </div>
      )}
      <div className="relative flex items-center select-none touch-none w-full h-5">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(Number(e.target.value))}
          className={cn(
            "w-full h-1.5 bg-surface-elevated rounded-lg appearance-none cursor-pointer accent-ops-cyan border border-border focus:outline-none focus:ring-1 focus:ring-ops-cyan/50 disabled:opacity-50 disabled:cursor-not-allowed",
            className
          )}
        />
      </div>
    </div>
  );
}
