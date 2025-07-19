"use client";
import Engine from "@/logic/Engine";
import GlobalVariables from "@/logic/GlobalVariables";
import React, { ReactNode, useEffect, useState } from "react";
import Events from "@/logic/Events";

type CanvasWrapperProps = {
  children: ReactNode;
};

export const CanvasWrapper = ({ children }: CanvasWrapperProps) => {
  return <div className="canvas-parent h-screen">{children}</div>;
};
export const Canvas = () => {
  const [isRestricted,setIsRestricted]=useState(false)
  useEffect(() => {
    const run = async () => {
      const canvas = document.querySelector(".canvas") as HTMLCanvasElement;
      const canvasParent = document.querySelector(
        ".canvas-parent"
      ) as HTMLDivElement;
      GlobalVariables.init(canvas, canvasParent);
      if(GlobalVariables.dimensions.width<500){
        setIsRestricted(true);
        return;
      }
      await Engine.init();
      Events.attachEvents();
      Engine.play();
    };

    run();
  }, []);

  return (
    <CanvasWrapper>
      {isRestricted&&<div className="absolute top-0 left-0 bottom-0 right-0 z-40 bg-black flex items-center justify-center text-3xl text-center">Sorry, this page cannot be viewed on a phone use a desktop</div>}
      <canvas className="canvas z-0" />
    </CanvasWrapper>
  );
};
