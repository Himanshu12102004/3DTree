import { useState } from "react";

type TogglerProps = {
  options: string[];
  head: string;
  handler?: (selected: string) => void;
};

export default function Toggler({ options, head, handler }: TogglerProps) {
  const [selected, setSelected] = useState(options[0]);

  const handleClick = (option: string) => {
    setSelected(option);
    handler?.(option);
  };

  return (
    <div className="mb-3">
      <div className="mb-2 text-[14px]">{head}</div>
      <div className="flex w-fit bg-gray-200 rounded-sm p-0.5">
        {options.map((option) => (
          <button
            key={option}
            onClick={() => handleClick(option)}
            className={`px-3 py-1 rounded-sm text-[14px] font-medium transition-colors cursor-pointer ${
              selected === option
                ? "bg-[#1876D1] text-white shadow"
                : "text-black hover:bg-gray-300"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
