"use client";
import { useEffect, useState } from "react";
import { Canvas } from "./components/Canvas";
import { FaSlash, FaTimes } from "react-icons/fa";
import { motion } from "framer-motion";
import { ToggleButton } from "./components/ToggleButton";
import MenuBar from "./components/MenuBar";
import GlobalVariables from "@/logic/GlobalVariables";
import { IoMdSettings } from "react-icons/io";
import { IoCarSport } from "react-icons/io5";
import Tutorial from "./components/Tutorial";
import { BsLungsFill } from "react-icons/bs";

export function createSlashedIcon(Icon: React.ElementType): React.ElementType {
  const SlashedIcon: React.FC<{ size?: number; color?: string }> = ({
    size = 32,
  }) => (
    <div style={{ position: "relative", width: size, height: size }}>
      <Icon size={size} className="text-foreground" />
      <FaSlash
        size={size}
        className="text-foreground"
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

const BasePage = () => {
  const [seenTutorial, setSeenTutorial] = useState(false);
  useEffect(() => {
    console.log("hjhj")
  const seen = window.localStorage.getItem("seenTutorial") === "Yes";
  setSeenTutorial(seen);
}, []);
  const [isDark, setIsDark] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAutoPilot, setIsAutoPilot] = useState(false);
  const [isBreathing, setIsBreathing] = useState(true);
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
          tip="Open the settings to tune different parameters."
          showTipOnActive={false}
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
            if (GlobalVariables.isAutoPilot) {
              GlobalVariables.autoPilotBrakesInitiated = true;
              setTimeout(() => {
                GlobalVariables.isAutoPilot = false;
                GlobalVariables.autoPilotSpeed = 0;
              }, GlobalVariables.autoPilotSpeed / GlobalVariables.autoPilotAcceleration);
            } else {
              GlobalVariables.autoPilotBrakesInitiated = false;
              GlobalVariables.isAutoPilot = true;
            }
            setIsAutoPilot(!GlobalVariables.autoPilotBrakesInitiated);
          }}
          tip="Toggle autopilot mode. It moves you forward automatically — just steer with your mouse."
          showTipOnActive={true}
        />
      </motion.div>

      <motion.div
        className="absolute top-5 right-25 z-10 w-6 h-6 flex"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <ToggleButton
          IconOn={BsLungsFill}
          IconOff={createSlashedIcon(BsLungsFill)}
          currentState={isBreathing}
          setcurrentState={() => {
            GlobalVariables.isBreathing = !GlobalVariables.isBreathing;
            setIsBreathing(GlobalVariables.isBreathing);
          }}
          tip="Toggle planet's breathing."
          showTipOnActive={true}
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
      {!seenTutorial && (
        <Tutorial
          seenTutorial={seenTutorial}
          setSeenTutorial={setSeenTutorial}
        ></Tutorial>
      )}
    </div>
  );
};

export default BasePage;
