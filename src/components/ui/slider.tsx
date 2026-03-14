"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const Slider = React.forwardRef<
  HTMLInputElement,
  Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange"> & { value?: number[]; onValueChange?: (value: number[]) => void; min?: number; max?: number; step?: number }
>(({ className, value = [5], onValueChange, min = 0, max = 100, step = 1, ...props }, ref) => {
  const v = value[0] ?? min;
  return (
    <input
      type="range"
      ref={ref}
      min={min}
      max={max}
      step={step}
      value={v}
      onChange={(e) => onValueChange?.([parseFloat(e.target.value)])}
      className={cn(
        "w-full h-2 rounded-lg appearance-none cursor-pointer bg-secondary accent-primary",
        className
      )}
      {...props}
    />
  );
});
Slider.displayName = "Slider";

export { Slider };
