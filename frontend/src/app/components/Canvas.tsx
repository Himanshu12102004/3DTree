"use client";
import Engine from "@/logic/Engine";
import GlobalVariables from "@/logic/GlobalVariables";
import React, { ReactNode, useEffect, useState } from "react";
import { FaCog, FaTimes } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";
import { ToggleButton } from "./ToggleButton";
import MenuBar from "./MenuBar";
import Events from "@/logic/Events";

type CanvasWrapperProps = {
  children: ReactNode;
};

const settingsPanelVariants = {
  hidden: { x: "100%" },
  visible: { x: 0 },
};

import { TbSteeringWheelFilled, TbSteeringWheelOff } from "react-icons/tb";

export const CanvasWrapper = ({ children }: CanvasWrapperProps) => {
  const [isDark, setIsDark] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAutoPilot, setIsAutoPilot] = useState(false);
  return (
    <div className={`${isDark ? "dark" : "light"} overflow-x-hidden relative`}>
      <div className="fps absolute bottom-0 right-0 text-foreground">0 FPS</div>

      <motion.div
        className="absolute top-5 right-5 z-30 w-6 h-6 flex"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <ToggleButton
          IconOn={FaCog}
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
          IconOn={TbSteeringWheelFilled}
          IconOff={TbSteeringWheelOff}
          currentState={isAutoPilot}
          setcurrentState={() => {
            GlobalVariables.isAutoPilot = !GlobalVariables.isAutoPilot;
            setIsAutoPilot(GlobalVariables.isAutoPilot);
          }}
        />
      </motion.div>
      <div className="canvas-parent h-screen">{children}</div>

      <AnimatePresence>
        {isSettingsOpen && (
          <motion.div
            key="settings"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={settingsPanelVariants}
            transition={{ duration: 0.1, ease: "easeInOut" }}
            className="bg-background w-full lg:w-1/3 h-screen absolute top-0 right-0 z-10 shadow-xl"
          >
            <MenuBar isDark={isDark} setIsDark={setIsDark} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const Canvas = () => {
  useEffect(() => {
    const run = async () => {
      const canvas = document.querySelector(".canvas") as HTMLCanvasElement;
      const canvasParent = document.querySelector(
        ".canvas-parent"
      ) as HTMLDivElement;
      GlobalVariables.init(canvas, canvasParent);
      await Engine.init();
      Events.attachEvents();
      Engine.play();
    };
    run();
  }, []);

  return (
    <CanvasWrapper>
      <canvas className="canvas" />
    </CanvasWrapper>
  );
};
