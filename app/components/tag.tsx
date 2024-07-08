import clsx from "clsx";
import React from "react";

export interface TagProps {
  name: string;
  disabled?: boolean;
  onDelete?: () => void;
  onClick?: () => void;
}

export const Tag: React.FC<TagProps> = ({
  name,
  onDelete,
  onClick,
  disabled,
}) => {
  return (
    <div
      onClick={onClick}
      className={clsx(
        "border border-[#2d6236] bg-[#1b3c21] p-5px text-sm font-bold leading-[1.15] text-[#4aa158]",
        onClick && "cursor-pointer",
        disabled && "opacity-50",
      )}
    >
      {name}
      {onDelete && (
        <>
          {" "}
          <button className="ml-5px" onClick={onDelete}>
            x
          </button>
        </>
      )}
    </div>
  );
};
