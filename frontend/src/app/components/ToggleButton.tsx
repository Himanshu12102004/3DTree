"use client";
import React from "react";
import { motion } from "framer-motion";

interface ToggleIconButtonProps {
  IconOn: React.ElementType;
  IconOff: React.ElementType;
  currentState: boolean;
  setcurrentState: (v: boolean) => void;
  size?: number;
  className?: string;
}

export const ToggleButton: React.FC<ToggleIconButtonProps> = ({
  IconOn,
  IconOff,
  currentState,
  setcurrentState,
  size = 24,
  className = "",
}) => {
  return (
    <div className={`relative w-6 h-6 cursor-pointer ${className}`} onClick={() => setcurrentState(!currentState)}>
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
        <IconOn size={size} className={'text-accent'} />
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
        <IconOff size={size} className={"text-accent"} />
      </motion.div>
    </div>
  );
};
