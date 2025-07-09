"use client";
import { useState } from "react";
import { Canvas } from "./components/Canvas";
import { FaCar, FaCog, FaSlash, FaTimes } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";
import { ToggleButton } from "./components/ToggleButton";
const settingsPanelVariants = {
  hidden: { x: "100%" },
  visible: { x: 0 },
};

import { TbSteeringWheelFilled, TbSteeringWheelOff } from "react-icons/tb";

import MenuBar from "./components/MenuBar";
import GlobalVariables from "@/logic/GlobalVariables";
import { style } from "framer-motion/client";
import { IoMdSettings } from "react-icons/io";
import { IoCarSport } from "react-icons/io5";

export function createSlashedIcon(Icon: React.ElementType): React.ElementType {
  const SlashedIcon: React.FC<{ size?: number; color?: string }> = ({
    size = 32,
  }) => (
    <div style={{ position: "relative", width: size, height: size }}>
      <Icon size={size} className="text-accent" />
      <FaSlash
        size={size}
        className="text-accent"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
        }}
      />
    </div>
  );
  return SlashedIcon;
}
const page = () => {
  const [isDark, setIsDark] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAutoPilot, setIsAutoPilot] = useState(false);
  return (
    <div
      className={`${isDark ? "dark" : ""}`}
      style={{ width: "100vw", height: "100vh", overflow: "hidden" }}
    >
      <div className="fps absolute bottom-0 right-0 text-foreground z-20">
        0 FPS
      </div>
      <motion.div
        className="absolute top-5 right-5 z-30 w-6 h-6 flex"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <ToggleButton
          IconOn={IoMdSettings}
          IconOff={FaTimes}
          currentState={isSettingsOpen}
          setcurrentState={setIsSettingsOpen}
        />
      </motion.div>

      <motion.div
        className="absolute top-5 right-15 z-10 w-6 h-6 flex"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <ToggleButton
          IconOn={IoCarSport}
          IconOff={createSlashedIcon(IoCarSport)}
          currentState={isAutoPilot}
          setcurrentState={() => {
            GlobalVariables.isAutoPilot = !GlobalVariables.isAutoPilot;
            setIsAutoPilot(GlobalVariables.isAutoPilot);
          }}
        />
      </motion.div>

      <div>
        <MenuBar
          isDark={isDark}
          setIsDark={setIsDark}
          isSettingsOpen={isSettingsOpen}
        />
      </div>
      <Canvas></Canvas>
    </div>
  );
};

export default page;
