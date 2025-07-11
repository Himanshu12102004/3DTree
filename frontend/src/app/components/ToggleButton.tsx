"use client";
import React, { useId } from "react";
import { motion } from "framer-motion";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";

interface ToggleIconButtonProps {
  IconOn: React.ElementType;
  IconOff: React.ElementType;
  currentState: boolean;
  setcurrentState: (v: boolean) => void;
  size?: number;
  className?: string;
  tip?: string;
  showTipOnActive: boolean;
}

export const ToggleButton: React.FC<ToggleIconButtonProps> = ({
  IconOn,
  IconOff,
  currentState,
  setcurrentState,
  size = 24,
  className = "",
  tip = "",
  showTipOnActive,
}) => {
  const tooltipId = useId();

  return (
    <>
      <div
        id={tooltipId}
        className={`relative w-6 h-6 cursor-pointer ${className}`}
        onClick={() => setcurrentState(!currentState)}
        data-tooltip-content={tip}
      >
        <motion.div
          initial={false}
          animate={{
            opacity: currentState ? 0 : 1,
            rotate: currentState ? 90 : 0,
            scale: currentState ? 0.8 : 1,
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 20,
          }}
          className="absolute inset-0"
        >
          <IconOn size={size} className="text-foreground" />
        </motion.div>

        <motion.div
          initial={false}
          animate={{
            opacity: currentState ? 1 : 0,
            rotate: currentState ? 0 : -90,
            scale: currentState ? 1 : 0.8,
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 20,
          }}
          className="absolute inset-0"
        >
          <IconOff size={size} className="text-foreground" />
        </motion.div>
      </div>

      {(tip &&!(currentState && !showTipOnActive) && (
          <Tooltip
            anchorSelect={`#${tooltipId}`}
            place="bottom"
            className="!max-w-64 !text-center !text-white !p-5 !rounded !bg-[rgba(0,0,0,0.7)]"
          />
        ))}
    </>
  );
};
