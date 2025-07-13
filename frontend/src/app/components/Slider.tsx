import * as React from "react";
import Box from "@mui/material/Box";
import MuiSlider from "@mui/material/Slider";

interface SliderProps {
  handler: (event: Event, value: number) => void;
  value: number;
  minimum: number;
  maximum: number;
  Icon: React.ElementType;
  step?: number;
  header: string;
}

export default function Slider({
  header,
  handler,
  value,
  minimum,
  maximum,
  step = 1,
  Icon,
}: SliderProps) {
  return (
    <div>
      <div className="text-foreground justify-end" style={{ fontSize: "14px" }}>
        {header}
      </div>
      <div className="flex items-center gap-4">
        {" "}
        <Icon size={20} className="text-foreground" />
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
        <div className="text-foreground" style={{ fontSize: "14px" }}>
          {Number.isInteger(value) ? value : value.toFixed(2)}
        </div>
      </div>
    </div>
  );
}
