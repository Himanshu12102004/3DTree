"use client";
import React, { useState } from "react";
import Button from "./Button";
import GlobalVariables from "@/logic/GlobalVariables";
import { toast } from "react-hot-toast";
import Engine from "@/logic/Engine";

interface SaveThePatternProps {
  setIsSaving: React.Dispatch<React.SetStateAction<boolean>>;
}

const SaveThePattern = ({ setIsSaving }: SaveThePatternProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [nameError, setNameError] = useState(false);
  const [descriptionError, setDescriptionError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (isLoading) return;

    let hasError = false;

    if (!name.trim()) {
      setNameError(true);
      hasError = true;
    }

    if (description.length > 200) {
      setDescriptionError(true);
      hasError = true;
    }

    if (hasError) return;

    setNameError(false);
    setDescriptionError(false);
    setIsLoading(true);

    const g = GlobalVariables;
    const blob = await Engine.getCanvasBlob();
    if (!blob) return;

    const formData = new FormData();
    formData.append("image", blob, "snapshot.png");
    formData.append("name", name);
    formData.append("description", description);
    formData.append(
      "configuration",
      JSON.stringify({
        angleX: g.angleX,
        angleZ: g.angleZ,
        rootRadius: g.rootRadius,
        rootHeight: g.rootHeight,
        branchingLevels: g.iterationCount,
        smoothingFactor: g.opSmoothRatio,
        dampeningFactor: g.dampeningFactor,
        cellDimensionX: g.cellDimensions[0],
        cellDimensionZ: g.cellDimensions[2],
        rootColor: g.rootColor,
        branchColor: g.branchColor,
        cameraPosition: g.cameraPosition,
        cameraDirection: g.cameraDirection,
        maxRayMarch: g.maxRayMarch,
      })
    );

    const res = await fetch("/api/creations", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      toast.success("Creation saved!");
      setIsSaving(false);
    } else {
      toast.error("Failed to save creation.");
    }
    setIsLoading(false);
    Engine.play();
  };

  return (
    <div>
      <div className="absolute top-0 left-0 bottom-0 right-0 z-30 bg-[rgba(0,0,0,0.5)] backdrop-blur-xs"></div>
      <div className="absolute top-1/2 left-1/2 z-40 transform -translate-x-1/2 -translate-y-1/2 flex flex-col p-10 gap-5 items-center bg-black">
        <div className="text-2xl">Upload the current creation</div>
        <input
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (nameError) setNameError(false);
          }}
          className={`bg-[rgb(0,0,0)] outline-0 p-4 w-[400px] border ${
            nameError ? "border-red-500" : "border-foreground"
          }`}
          placeholder="Give a name to creation"
        />

        <textarea
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            if (descriptionError && e.target.value.length <= 200)
              setDescriptionError(false);
          }}
          className={`bg-[rgb(0,0,0)] outline-0 p-4 w-[400px] border resize-none ${
            descriptionError ? "border-red-500" : "border-foreground"
          }`}
          placeholder="Describe your creation (optional)"
          rows={4}
        />
        {descriptionError && (
          <div className="text-red-500 text-sm -mt-3">
            Description must be under 200 characters.
          </div>
        )}

        <div className="flex gap-10">
          <Button
            text="Cancel"
            shouldShow={true}
            handler={() => {
              setIsSaving(false);
              Engine.play();
            }}
          />
          <Button
            text="Save"
            shouldShow={true}
            handler={handleSave}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default SaveThePattern;
