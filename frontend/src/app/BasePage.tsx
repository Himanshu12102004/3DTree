"use client";
import { useEffect, useState } from "react";
import { Canvas } from "./components/Canvas";
import { FaSlash } from "react-icons/fa";
import { FaDownload, FaUpload } from "react-icons/fa6";
import { IconButton, ToggleIcon } from "./components/Icons";
import MenuBar from "./components/MenuBar";
import GlobalVariables from "@/logic/GlobalVariables";
import { IoMdSettings } from "react-icons/io";
import { IoCarSport } from "react-icons/io5";
import Tutorial from "./components/Tutorial";
import { BsLungsFill } from "react-icons/bs";
import { MdOutlineTravelExplore } from "react-icons/md";
import SaveThePattern from "./components/SaveThePattern";
import { Toaster } from "react-hot-toast";
import Discover from "./components/Discover";
import Engine from "@/logic/Engine";

export function createSlashedIcon(Icon: React.ElementType): React.ElementType {
  const SlashedIcon: React.FC<{ size?: number; color?: string }> = ({
    size = 24,
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
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAutoPilot, setIsAutoPilot] = useState(false);
  const [isBreathing, setIsBreathing] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDiscoverOpen, setIsDiscoverOpen] = useState(false);

  useEffect(() => {
    const seen = window.localStorage.getItem("seenTutorial") === "Yes";
    setSeenTutorial(seen);
  }, []);

  return (
    <div className={`dark text-foreground`}>
      <Toaster position="bottom-right" />
      {isSaving && <SaveThePattern setIsSaving={setIsSaving}></SaveThePattern>}
      {isDiscoverOpen && (
        <Discover setIsDiscoverOpen={setIsDiscoverOpen}></Discover>
      )}
      <div className="fps absolute bottom-0 right-0 text-foreground z-20">
        0 FPS
      </div>
      <div className="absolute top-7 z-10 right-5 flex flex-col gap-5">
        <IconButton
          Icon={IoMdSettings}
          handler={() => {
            setIsSettingsOpen(true);
          }}
          tip="Open the settings."
        />

        <ToggleIcon
          IconOn={IoCarSport}
          IconOff={createSlashedIcon(IoCarSport)}
          currentState={isAutoPilot}
          handler={() => {
            setIsAutoPilot(GlobalVariables.cameraBrakesInitiated);
            if (!GlobalVariables.cameraBrakesInitiated) {
              GlobalVariables.cameraBrakesInitiated = true;
              GlobalVariables.autoPilotTimeOut = setTimeout(() => {
                GlobalVariables.isAutoPilot = false;
                GlobalVariables.cameraSpeed = 0;
              }, (GlobalVariables.cameraSpeed * 1000) / GlobalVariables.cameraAutopilotAcceleration);
            } else {
              clearTimeout(GlobalVariables.autoPilotTimeOut);
              GlobalVariables.cameraBrakesInitiated = false;
              GlobalVariables.isAutoPilot = true;
            }
          }}
          tip="Auto-pilot mode: Just steer"
          showTipOnActive={true}
        />

        <ToggleIcon
          IconOn={BsLungsFill}
          IconOff={createSlashedIcon(BsLungsFill)}
          currentState={isBreathing}
          handler={(value) => {
            GlobalVariables.isBreathing = value;
            setIsBreathing(GlobalVariables.isBreathing);
          }}
          tip="Toggle planet's breathing."
          showTipOnActive={true}
        />

        <IconButton
          Icon={FaDownload}
          handler={() => {
            Engine.downloadCanvasImage();
          }}
          tip="Want to make this your wallpaper? Just download it."
        />
        <IconButton
          Icon={FaUpload}
          handler={() => {
            Engine.pause();
            setIsSaving(true);
          }}
          tip="Want your creation to be seen by everyone? Upload your creation!"
        />

        <IconButton
          Icon={MdOutlineTravelExplore}
          handler={() => {
            Engine.pause();
            setIsDiscoverOpen(true);
          }}
          tip="Discover what others have created."
        />
      </div>

      <div>
        <MenuBar
          setIsSettingsOpen={setIsSettingsOpen}
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
