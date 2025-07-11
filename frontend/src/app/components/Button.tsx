import React from "react";

type ButtonProps = {
  text: string;
  shouldShow: boolean;
  handler: () => void;
};

const Button: React.FC<ButtonProps> = ({ text, shouldShow, handler }) => {
  return (
    <div className="flex justify-center items-center">
      <button
        className="px-4 py-2 bg-white text-black rounded hover:bg-gray-200"
        style={{
          marginTop: shouldShow ? "10px" : "0",
          height: shouldShow ? "100%" : "0",
          opacity: shouldShow ? "1" : "0",
          transition: shouldShow
            ? "opacity 0.5s ease-in-out, margin-top 0.5s"
            : "none",
        }}
        onClick={handler}
      >
        {text}
      </button>
    </div>
  );
};

export default Button;
