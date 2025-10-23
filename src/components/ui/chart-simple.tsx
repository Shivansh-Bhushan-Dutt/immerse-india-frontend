// Simple chart placeholder - original chart component has complex typing issues
import * as React from "react";

// Basic chart components as placeholders
export const ChartContainer = ({ children, ...props }: React.ComponentProps<"div">) => (
  <div {...props}>{children}</div>
);

export const ChartTooltip = () => null;
export const ChartTooltipContent = () => null;
export const ChartLegend = () => null;
export const ChartLegendContent = () => null;