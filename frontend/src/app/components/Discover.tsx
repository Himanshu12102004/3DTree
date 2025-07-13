"use client";
import React, { useEffect, useState } from "react";
import Button from "./Button";
import GlobalVariables from "@/logic/GlobalVariables";
import Engine from "@/logic/Engine";

export interface Creation {
  _id?: string;
  name: string;
  description?: string;
  imageUrl: string;
  configuration: {
    angleX: number;
    angleZ: number;
    rootRadius: number;
    rootHeight: number;
    branchingLevels: number;
    smoothingFactor: number;
    dampeningFactor: number;
    cellDimensionX: number;
    cellDimensionZ: number;
    rootColor: [number, number, number];
    branchColor: [number, number, number];
    cameraPosition: [number, number, number];
    cameraDirection: [number, number];
    maxRayMarch: number;
  };
}

const loading = (
  <svg width="50" height="50" viewBox="0 0 50 50">
    <defs>
      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fff"></stop>
        <stop offset="100%" stopColor="#fff"></stop>
      </linearGradient>
    </defs>
    <circle
      cx="25"
      cy="25"
      r="20"
      fill="none"
      stroke="url(#gradient)"
      stroke-width="4"
      stroke-dasharray="31.4 31.4"
    >
      <animateTransform
        attributeName="transform"
        type="rotate"
        from="0 25 25"
        to="360 25 25"
        dur="1s"
        repeatCount="indefinite"
      ></animateTransform>
    </circle>
  </svg>
);

const Card = ({
  details,
  setIsDiscoverOpen,
}: {
  details: Creation;
  setIsDiscoverOpen: (value: boolean) => void;
}) => (
  <div className="p-4 border rounded bg-black w-96 flex flex-col justify-between gap-5">
    <img src={details.imageUrl} alt="" className=" object-contain rounded" />
    <div className="flex gap-4 flex-col">
      <div>{details.name}</div>
      {details.description && (
        <div className="text-xs">{details.description}</div>
      )}
    </div>
    <Button
      shouldShow={true}
      text={"Use"}
      handler={() => {
        const g = GlobalVariables;
        const conf = details.configuration;
        g.angleX = conf.angleX;
        g.angleZ = conf.angleZ;
        g.rootRadius = conf.rootRadius;
        g.rootHeight = conf.rootHeight;
        g.iterationCount = conf.branchingLevels;
        g.opSmoothRatio = conf.smoothingFactor;
        g.dampeningFactor = conf.dampeningFactor;
        g.cellDimensions[0] = conf.cellDimensionX;
        g.cellDimensions[2] = conf.cellDimensionZ;
        g.rootColor = conf.rootColor;
        g.branchColor = conf.branchColor;
        g.cameraDirection = conf.cameraDirection;
        g.cameraPosition = conf.cameraPosition;
        g.maxRayMarch = conf.maxRayMarch;
        g.isConfigurationChanged = !g.isConfigurationChanged;
        Engine.play();
        setIsDiscoverOpen(false);
        Engine.initializeUniforms();
      }}
    />
  </div>
);

interface DiscoverProps {
  setIsDiscoverOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Discover = ({ setIsDiscoverOpen }: DiscoverProps) => {
  const [creations, setCreations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCreations = async () => {
      setIsLoading(true);
      const res = await fetch("/api/creations");
      const data = await res.json();
      setCreations(data);
      setIsLoading(false);
    };
    fetchCreations();
  }, []);

  return (
    <div>
      <div className="absolute top-1/2 left-1/2 z-40 transform -translate-x-1/2 -translate-y-1/2 flex flex-col p-10 gap-5 h-full overflow-y-auto w-full items-center bg-[rgba(0,0,0,0.5)] backdrop-blur-md ">
        <div className="text-2xl mb-4 text-center">Discover</div>
        <div className="overflow-scroll">
          {isLoading ? (
            <div className="flex justify-center items-center flex-col gap-5">
              <div>{loading}</div>
              <div className="text-center">
                Hang tight! We’re summoning awesome creations from fellow
                explorers...
              </div>
            </div>
          ) : creations.length === 0 ? (
            <div className="text-white text-center">No creations found.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {creations.map((item: Creation) => (
                <Card
                  key={item._id}
                  details={item}
                  setIsDiscoverOpen={setIsDiscoverOpen}
                />
              ))}
            </div>
          )}
        </div>
        <Button
          shouldShow={true}
          handler={() => {
            Engine.play();
            setIsDiscoverOpen(false);
          }}
          text="Close"
        ></Button>
      </div>
    </div>
  );
};

export default Discover;
