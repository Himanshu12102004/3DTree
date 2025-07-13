"use client";
import React, { useId } from "react";
import { motion } from "framer-motion";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";

interface IconButtonProps {
  Icon: React.ElementType;
  handler: () => void;
  size?: number;
  className?: string;
  tip?: string;
}

export const IconButton: React.FC<IconButtonProps> = ({
  Icon,
  handler,
  size = 24,
  className = "",
  tip = "",
}) => {
  const tooltipId = useId();

  return (
    <>
      <motion.div 
      whileHover={{scale:1.4}}>
        <div
          id={tooltipId}
          className={`relative w-6 h-6 cursor-pointer ${className}`}
          onClick={handler}
          data-tooltip-content={tip}
        >
          <Icon size={size} className="text-foreground" />
        </div>
      </motion.div>

      {tip && (
        <Tooltip
          anchorSelect={`#${tooltipId}`}
          place="left"
          float={false}
          className="!max-w-64 !text-center !text-white !p-3 !rounded !bg-[rgba(0,0,0,0.7)]"
        />
      )}
    </>
  );
};

interface ToggleIconProps {
  IconOn: React.ElementType;
  IconOff: React.ElementType;
  currentState: boolean;
  handler: (v: boolean) => void;
  size?: number;
  className?: string;
  tip?: string;
  showTipOnActive: boolean;
}

export const ToggleIcon: React.FC<ToggleIconProps> = ({
  IconOn,
  IconOff,
  currentState,
  handler,
  size = 24,
  className = "",
  tip = "",
  showTipOnActive,
}) => {
  const tooltipId = useId();

  return (
    <>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.4 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        id={tooltipId}
        className={`relative w-6 h-6 cursor-pointer ${className}`}
        onClick={() => handler(!currentState)}
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
      </motion.div>

      {tip && !(currentState && !showTipOnActive) && (
        <Tooltip
          anchorSelect={`#${tooltipId}`}
          place="left"
          float={false}
          className="!max-w-64 !text-center !text-white !p-3 !rounded !bg-[rgba(0,0,0,0.7)]"
        />
      )}
    </>
  );
};
