"use client";
import Engine from "@/logic/Engine";
import GlobalVariables from "@/logic/GlobalVariables";
import React, { ReactNode, useEffect } from "react";
import Events from "@/logic/Events";

type CanvasWrapperProps = {
  children: ReactNode;
};

export const CanvasWrapper = ({ children }: CanvasWrapperProps) => {
  console.log("canvas Wrapper");
  return <div className="canvas-parent h-screen">{children}</div>;
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
      <canvas className="canvas z-0" />
    </CanvasWrapper>
  );
};
