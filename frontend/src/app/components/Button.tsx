import React from "react";

type ButtonProps = {
  text: string;
  shouldShow: boolean;
  handler: () => void;
  isLoading?: boolean;
};

const loading = (
  <svg width="30" height="30" viewBox="0 0 50 50">
    <defs>
      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="##000"></stop>
        <stop offset="100%" stopColor="#000"></stop>
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
const Button: React.FC<ButtonProps> = ({
  text,
  shouldShow,
  handler,
  isLoading = false,
}) => {
  return (
    <div className="flex justify-center items-center">
      <button
        className={`px-4 py-2 bg-white text-black rounded hover:bg-gray-200 cursor-pointer min-w-[150px] flex justify-center items-center`}
        style={{
          height: shouldShow ? "100%" : "0",
          opacity: shouldShow ? "1" : "0",
          transition: shouldShow
            ? "opacity 0.5s ease-in-out, margin-top 0.5s"
            : "none",
        }}
        onClick={handler}
      >
        {isLoading ? loading : text}
      </button>
    </div>
  );
};

export default Button;
