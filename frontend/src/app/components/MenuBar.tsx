import React, { useEffect, useState } from "react";
import { ToggleButton } from "./ToggleButton";
import { IoMdMoon, IoMdSunny } from "react-icons/io";
import Slider from "./Slider";
import GlobalVariables from "@/logic/GlobalVariables";
import ColorPicker from "./ColorPicker";
import { PiAngle, PiCompassTool } from "react-icons/pi";
import { SlidersHorizontal, Tree } from "phosphor-react";
import { RxDimensions, RxHeight } from "react-icons/rx";
import { WiStrongWind } from "react-icons/wi";

type MenuBarProps = {
  isDark: boolean;
  setIsDark: (value: boolean) => void;
  isSettingsOpen: boolean;
};

function toRadian(angle: number): number {
  return (angle * Math.PI) / 180;
}

const MenuBar: React.FC<MenuBarProps> = ({
  isDark,
  setIsDark,
  isSettingsOpen,
}) => {
  const [angleX, setAngleX] = useState(0);
  const [angleZ, setAngleZ] = useState(0);
  const [iterationCount, setIterationCount] = useState(0);
  const [opSmoothRatio, setOpSmoothRatio] = useState(0);
  const [rootRadius, setRootRadius] = useState(0);
  const [rootHeight, setRootHeight] = useState(0);
  const [rootColor, setRootColor] = useState([0, 0, 0] as [
    number,
    number,
    number
  ]);
  const [branchColor, setBranchColor] = useState([0, 0, 0] as [
    number,
    number,
    number
  ]);
  const [dampningFactor, setDampeningFactor] = useState(0);
  const [cellDimensionsX, setCellDimensionsX] = useState(0);
  const [cellDimensionsZ, setCellDimensionsZ] = useState(0);

  useEffect(() => {
    const giveRgba = (color: [number, number, number]) => {
      console.log("Color received:", color);
      return [
        Math.round(color[0] * 255),
        Math.round(color[1] * 255),
        Math.round(color[2] * 255),
      ] as [number, number, number];
    };
    if (!GlobalVariables.isInitialized) return;
    setAngleX(GlobalVariables.angleX);
    setAngleZ(GlobalVariables.angleZ);
    setIterationCount(GlobalVariables.iterationCount);
    setOpSmoothRatio(GlobalVariables.opSmoothRatio);
    setRootRadius(GlobalVariables.rootRadius);
    setRootHeight(GlobalVariables.rootHeight);
    setRootColor(giveRgba(GlobalVariables.rootColor));
    setBranchColor(giveRgba(GlobalVariables.branchColor));
    setDampeningFactor(GlobalVariables.dampeningFactor);
    setCellDimensionsX(GlobalVariables.cellDimensions[0]);
    setCellDimensionsZ(GlobalVariables.cellDimensions[2]);
  }, [GlobalVariables.isInitialized]);
  const handleAngleXChange = (e: Event, value: number | number[]) => {
    const newValue = value as number;
    setAngleX(newValue);
    GlobalVariables.angleX = newValue;
    GlobalVariables.gl.uniform1f(
      GlobalVariables.uniforms.angleX!,
      toRadian(newValue)
    );
  };

  const handleAngleZChange = (e: Event, value: number | number[]) => {
    const newValue = value as number;
    setAngleZ(newValue);
    GlobalVariables.angleZ = newValue;
    GlobalVariables.gl.uniform1f(
      GlobalVariables.uniforms.angleZ!,
      toRadian(newValue)
    );
  };

  const handleIterationCountChange = (e: Event, value: number | number[]) => {
    const newValue = value as number;
    setIterationCount(newValue);
    GlobalVariables.iterationCount = newValue;
    GlobalVariables.gl.uniform1i(
      GlobalVariables.uniforms.iterationCount!,
      newValue
    );
  };
  const handleOpSmoothRatioChange = (e: Event, value: number | number[]) => {
    const newValue = value as number;
    setOpSmoothRatio(newValue);
    GlobalVariables.opSmoothRatio = newValue;
    GlobalVariables.gl.uniform1f(
      GlobalVariables.uniforms.opSmoothRatio!,
      newValue
    );
  };
  const handleRootRadiusChange = (e: Event, value: number | number[]) => {
    const newValue = value as number;
    setRootRadius(newValue);
    GlobalVariables.rootRadius = newValue;
    GlobalVariables.gl.uniform1f(
      GlobalVariables.uniforms.rootRadius!,
      newValue
    );
  };

  const handleRootHeightChange = (e: Event, value: number | number[]) => {
    const newValue = value as number;
    setRootHeight(newValue);
    GlobalVariables.rootHeight = newValue;
    GlobalVariables.gl.uniform1f(
      GlobalVariables.uniforms.rootHeight!,
      newValue
    );
  };
  const handleRootColorChange = (color: [number, number, number]) => {
    setRootColor(color);
    GlobalVariables.rootColor[0] = color[0] / 255;
    GlobalVariables.rootColor[1] = color[1] / 255;
    GlobalVariables.rootColor[2] = color[2] / 255;
    GlobalVariables.gl.uniform3f(
      GlobalVariables.uniforms.rootColor!,
      GlobalVariables.rootColor[0],
      GlobalVariables.rootColor[1],
      GlobalVariables.rootColor[2]
    );
  };
  const handleBranchColorChange = (color: [number, number, number]) => {
    setBranchColor(color);
    GlobalVariables.branchColor[0] = color[0] / 255;
    GlobalVariables.branchColor[1] = color[1] / 255;
    GlobalVariables.branchColor[2] = color[2] / 255;
    GlobalVariables.gl.uniform3f(
      GlobalVariables.uniforms.branchColor!,
      GlobalVariables.branchColor[0],
      GlobalVariables.branchColor[1],
      GlobalVariables.branchColor[2]
    );
  };
  const handleDampeningFactorChange = (e: Event, value: number | number[]) => {
    const newValue = value as number;
    setDampeningFactor(newValue);
    GlobalVariables.dampeningFactor = newValue;
    GlobalVariables.gl.uniform1f(
      GlobalVariables.uniforms.dampeningFactor!,
      newValue
    );
  };
  const handleCellDimensionsChangeX = (e: Event, value: number | number[]) => {
    const newValue = value as number;
    // Assuming cell dimensions are uniform for simplicity
    const cellDimensionX = newValue;
    GlobalVariables.cellDimensions[0] = cellDimensionX;
    GlobalVariables.gl.uniform3f(
      GlobalVariables.uniforms.cellDimensions!,
      GlobalVariables.cellDimensions[0],
      GlobalVariables.cellDimensions[1],
      GlobalVariables.cellDimensions[2]
    );
    setCellDimensionsX(GlobalVariables.cellDimensions[0]);
  };
  const handleCellDimensionsChangeZ = (e: Event, value: number | number[]) => {
    const newValue = value as number;
    // Assuming cell dimensions are uniform for simplicity
    const cellDimensionZ = newValue;
    GlobalVariables.cellDimensions[2] = cellDimensionZ;
    GlobalVariables.gl.uniform3f(
      GlobalVariables.uniforms.cellDimensions!,
      GlobalVariables.cellDimensions[0],
      GlobalVariables.cellDimensions[1],
      GlobalVariables.cellDimensions[2]
    );
    setCellDimensionsZ(GlobalVariables.cellDimensions[2]);
  };

  return (
    <div
      className={`bg-background ${isSettingsOpen?"w-full lg:w-1/3":"w-0"} h-screen absolute top-0 right-0 z-20 shadow-xl`}
      style={{
        overflowY: "scroll",
        transform: isSettingsOpen ? "translateX(0)" : "translateX(100%)",
        opacity: isSettingsOpen ? "1" : "0",
        transition: "all 0.1s",
      }}
    >
      <div className="relative ">
        <div className="pt-20 pl-15 pb-10 h-screen overflow-y-scroll">
          <div className="text-4xl text-foreground">Controls</div>
          <div className="absolute right-15 top-5">
            <ToggleButton
              IconOn={IoMdSunny}
              IconOff={IoMdMoon}
              currentState={isDark}
              setcurrentState={setIsDark}
            />
          </div>

          <div className="pt-6 flex flex-col gap-2">
            <Slider
              header="Angle-X"
              minimum={0}
              maximum={90}
              value={angleX}
              handler={handleAngleXChange}
              Icon={PiAngle}
            />

            <Slider
              header="Angle-Z"
              minimum={0}
              maximum={90}
              value={angleZ}
              handler={handleAngleZChange}
              Icon={PiAngle}
            />

            <Slider
              header="Root Radius"
              minimum={0.5}
              maximum={10}
              step={0.01}
              value={rootRadius}
              handler={handleRootRadiusChange}
              Icon={PiCompassTool}
            />

            <Slider
              header="Root Height"
              minimum={0.5}
              maximum={10}
              step={0.01}
              value={rootHeight}
              handler={handleRootHeightChange}
              Icon={RxHeight}
            />

            <Slider
              header="Branching Levels"
              minimum={1}
              maximum={30}
              value={iterationCount}
              handler={handleIterationCountChange}
              Icon={Tree}
            />

            <Slider
              header="Smoothing factor"
              minimum={0.000001}
              maximum={5}
              step={0.000001}
              value={opSmoothRatio}
              handler={handleOpSmoothRatioChange}
              Icon={SlidersHorizontal}
            />

            <Slider
              header="Dampening Factor"
              minimum={0.01}
              maximum={1}
              step={0.001}
              value={dampningFactor}
              handler={handleDampeningFactorChange}
              Icon={WiStrongWind}
            />

            <Slider
              header="Cell Dimension-X"
              minimum={1}
              maximum={100}
              step={1}
              value={cellDimensionsX}
              handler={handleCellDimensionsChangeX}
              Icon={RxDimensions}
            />

            <Slider
              header="Cell Dimension-Z"
              minimum={1}
              maximum={100}
              step={1}
              value={cellDimensionsZ}
              handler={handleCellDimensionsChangeZ}
              Icon={RxDimensions}
            />

            <div>
              <div className="text-foreground">Root Color</div>
              <ColorPicker color={rootColor} handler={handleRootColorChange} />
            </div>

            <div>
              <div className="text-foreground">Branch Color</div>
              <ColorPicker
                color={branchColor}
                handler={handleBranchColorChange}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuBar;
