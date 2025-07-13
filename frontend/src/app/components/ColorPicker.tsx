import React, { useState } from "react";
import { RgbaColorPicker } from "react-colorful";

interface ColorPickerProps {
  color: [number, number, number];
  handler: (color: [number, number, number]) => void;
}

export default function ColorPicker({ color, handler }: ColorPickerProps) {
  const [visible, setVisible] = useState(false);
  const togglePicker = () => setVisible(!visible);

  return (
    <div>
      <button
        onClick={togglePicker}
        style={{
          backgroundColor: `rgb(${color[0]}, ${color[1]}, ${color[2]})`,
          color: `rgb(${255 - color[0]}, ${255 - color[1]}, ${255 - color[2]})`,
          width: "260px",
          padding: "0.5rem 1rem",
          border: "none",
          cursor: "pointer",
        }}
      >
        rgb({color[0]}, {color[1]}, {color[2]})
      </button>
      {visible && (
        <div style={{ marginTop: "1rem" }}>
          <RgbaColorPicker
            color={{ r: color[0], g: color[1], b: color[2], a: 1 }}
            onChange={(col) => handler([col.r, col.g, col.b])}
          />
        </div>
      )}
    </div>
  );
}
