import React, { useEffect, useState } from "react";
import { IconButton } from "./Icons";
import Slider from "./Slider";
import GlobalVariables from "@/logic/GlobalVariables";
import ColorPicker from "./ColorPicker";
import { PiAngle, PiCompassTool } from "react-icons/pi";
import { SlidersHorizontal, Tree } from "phosphor-react";
import { RxDimensions, RxHeight } from "react-icons/rx";
import { WiStrongWind } from "react-icons/wi";
import { FaTimes } from "react-icons/fa";
import { HiOutlineLightBulb } from "react-icons/hi";
type MenuBarProps = {
  setIsSettingsOpen: (value: boolean) => void;
  isSettingsOpen: boolean;
};

function toRadian(angle: number): number {
  return (angle * Math.PI) / 180;
}

const MenuBar: React.FC<MenuBarProps> = ({
  setIsSettingsOpen,
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
  const [maxRayMarch, setMaxRayMarch] = useState(0);
  useEffect(() => {
    const giveRgba = (color: [number, number, number]) => {
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
    setMaxRayMarch(GlobalVariables.maxRayMarch);
  }, [GlobalVariables.isInitialized, GlobalVariables.isConfigurationChanged]);

  const handleAngleXChange = (e: Event, value: number) => {
    GlobalVariables.angleX = value;
    GlobalVariables.gl.uniform1f(
      GlobalVariables.uniforms.angleX!,
      toRadian(value)
    );
    setAngleX(value);
  };

  const handleAngleZChange = (e: Event, value: number) => {
    GlobalVariables.angleZ = value;
    GlobalVariables.gl.uniform1f(
      GlobalVariables.uniforms.angleZ!,
      toRadian(value)
    );
    setAngleZ(value);
  };

  const handleIterationCountChange = (e: Event, value: number) => {
    GlobalVariables.iterationCount = value;
    GlobalVariables.gl.uniform1i(
      GlobalVariables.uniforms.iterationCount!,
      value
    );
    setIterationCount(value);
  };
  const handleOpSmoothRatioChange = (e: Event, value: number) => {
    GlobalVariables.opSmoothRatio = value;
    GlobalVariables.gl.uniform1f(
      GlobalVariables.uniforms.opSmoothRatio!,
      value
    );
    setOpSmoothRatio(value);
  };
  const handleRootRadiusChange = (e: Event, value: number) => {
    GlobalVariables.rootRadius = value;
    GlobalVariables.gl.uniform1f(GlobalVariables.uniforms.rootRadius!, value);
    setRootRadius(value);
  };

  const handleRootHeightChange = (e: Event, value: number) => {
    GlobalVariables.rootHeight = value;
    GlobalVariables.gl.uniform1f(GlobalVariables.uniforms.rootHeight!, value);
    setRootHeight(GlobalVariables.rootHeight);
  };
  const handleRootColorChange = (color: [number, number, number]) => {
    GlobalVariables.rootColor[0] = color[0] / 255;
    GlobalVariables.rootColor[1] = color[1] / 255;
    GlobalVariables.rootColor[2] = color[2] / 255;
    GlobalVariables.gl.uniform3f(
      GlobalVariables.uniforms.rootColor!,
      GlobalVariables.rootColor[0],
      GlobalVariables.rootColor[1],
      GlobalVariables.rootColor[2]
    );
    setRootColor(color);
  };
  const handleBranchColorChange = (color: [number, number, number]) => {
    GlobalVariables.branchColor[0] = color[0] / 255;
    GlobalVariables.branchColor[1] = color[1] / 255;
    GlobalVariables.branchColor[2] = color[2] / 255;
    GlobalVariables.gl.uniform3f(
      GlobalVariables.uniforms.branchColor!,
      GlobalVariables.branchColor[0],
      GlobalVariables.branchColor[1],
      GlobalVariables.branchColor[2]
    );
    setBranchColor(color);
  };
  const handleDampeningFactorChange = (_: Event, value: number) => {
    GlobalVariables.dampeningFactor = value;
    GlobalVariables.gl.uniform1f(
      GlobalVariables.uniforms.dampeningFactor!,
      value
    );
    setDampeningFactor(value);
  };

  const handleCellDimensionsChangeX = (_: Event, value: number) => {
    GlobalVariables.cellDimensions[0] = value;
    GlobalVariables.gl.uniform3f(
      GlobalVariables.uniforms.cellDimensions!,
      value,
      GlobalVariables.cellDimensions[1],
      GlobalVariables.cellDimensions[2]
    );
    setCellDimensionsX(value);
  };

  const handleCellDimensionsChangeZ = (_: Event, value: number) => {
    GlobalVariables.cellDimensions[2] = value;
    GlobalVariables.gl.uniform3f(
      GlobalVariables.uniforms.cellDimensions!,
      GlobalVariables.cellDimensions[0],
      GlobalVariables.cellDimensions[1],
      value
    );
    setCellDimensionsZ(value);
  };

  const handleMaxRayMarch = (_: Event, value: number) => {
    GlobalVariables.maxRayMarch = value;
    GlobalVariables.gl.uniform1i(GlobalVariables.uniforms.maxRayMarch!, value);
    setMaxRayMarch(value);
  };

  return (
    <div
      className={`bg-background ${
        isSettingsOpen ? "w-full lg:w-1/3" : "w-0"
      } h-screen absolute top-0 right-0 z-20 shadow-xl`}
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
          <div className="absolute right-5 top-5">
            <IconButton
              Icon={FaTimes}
              handler={() => {
                setIsSettingsOpen(false);
              }}
            ></IconButton>
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
            <Slider
              header="Max Ray March"
              minimum={1}
              maximum={100}
              step={1}
              value={maxRayMarch}
              handler={handleMaxRayMarch}
              Icon={HiOutlineLightBulb}
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
