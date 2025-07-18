"use client";
import React, { useEffect, useState } from "react";
import Button from "./Button";
import GlobalVariables from "@/logic/GlobalVariables";
import Engine from "@/logic/Engine";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
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
const GhostCardGrid = () => {
  return (
    <div className="grid grid-cols-3 gap-6 w-full px-4">
      {Array.from({ length: 9 }).map((_, i) => (
        <div
          key={i}
          className="w-90 h-72 bg-zinc-800 rounded-md animate-pulse flex flex-col justify-between p-4"
        >
          <div className="h-6 bg-zinc-700 rounded w-2/3 mb-2"></div>
          <div className="h-4 bg-zinc-700 rounded w-full mb-1"></div>
          <div className="h-4 bg-zinc-700 rounded w-5/6 mb-1"></div>
          <div className="h-4 bg-zinc-700 rounded w-1/2"></div>
          <div className="mt-auto h-10 bg-zinc-700 rounded w-full"></div>
        </div>
      ))}
    </div>
  );
};

const Card = ({
  details,
  setIsDiscoverOpen,
}: {
  details: Creation;
  setIsDiscoverOpen: (value: boolean) => void;
}) => (
  <div className=" w-90 p-6 border rounded bg-black flex flex-col justify-between gap-5">
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
  const [pageNo, setPageNo] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchCreations = async () => {
    setIsLoading(true);
    const res = await fetch(`/api/creations?page=${pageNo}`);
    const data = await res.json();
    setTotalPages(data.totalPages);
    setCreations(data.creations);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchCreations();
  }, [pageNo]);

  return (
    <div>
      <div className="absolute top-1/2 left-1/2 z-40 transform -translate-x-1/2 -translate-y-1/2 flex flex-col p-10 gap-5 h-full overflow-y-auto w-full items-center bg-[rgba(0,0,0,0.5)] backdrop-blur-md ">
        <div className="text-2xl mb-4 text-center">Discover</div>
        {isLoading ? (
          <div className="h-[78vh] overflow-scroll">
            <GhostCardGrid />
          </div>
        ) : creations.length === 0 ? (
          <div className="text-white text-center">No creations found.</div>
        ) : (
          <div className="flex items-center gap-8">
            <div
              className={`${
                pageNo === 1
                  ? "bg-[rgba(50,50,50)] cursor-not-allowed"
                  : "bg-white cursor-pointer"
              } text-center rounded-full p-4`}
              onClick={() => {
                if (pageNo === 1) return;
                setPageNo(pageNo - 1);
              }}
            >
              <FaChevronLeft className="text-black" size={24} />
            </div>
            <div className="h-[78vh] overflow-scroll">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 self-start">
                {creations.map((item: Creation) => (
                  <Card
                    key={item._id}
                    details={item}
                    setIsDiscoverOpen={setIsDiscoverOpen}
                  />
                ))}
              </div>
            </div>
            <div
              className={`${
                pageNo === totalPages
                  ? "bg-[rgba(50,50,50)] cursor-not-allowed"
                  : "bg-white cursor-pointer"
              } text-center rounded-full p-4`}
              onClick={() => {
                if (pageNo === totalPages) return;
                setPageNo(pageNo + 1);
              }}
            >
              <FaChevronRight className="text-black" size={24} />
            </div>
          </div>
        )}
        <Button
          shouldShow={true}
          handler={() => {
            Engine.play();
            setIsDiscoverOpen(false);
          }}
          text="Close"
        />
      </div>
    </div>
  );
};

export default Discover;
