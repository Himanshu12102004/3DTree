import * as React from "react";
import Box from "@mui/material/Box";
import MuiSlider from "@mui/material/Slider";

interface SliderProps {
  handler: (event: Event, value: number | number[]) => void;
  value: number;
  minimum: number;
  maximum: number;
  icon: React.ReactNode;
  step?: number;
}

export default function Slider({
  handler,
  value,
  minimum,
  maximum,
  step = 1,
  icon,
}: SliderProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="text-icon">{icon}</div>

      <Box sx={{ width: 250 }} className="pt-2">
        <MuiSlider
          value={value}
          size="small"
          step={step}
          onChange={handler}
          aria-label="Custom"
          valueLabelDisplay="off"
          min={minimum}
          max={maximum}
        />
      </Box>
      <div className="text-foreground">{value}</div>
    </div>
  );
}
