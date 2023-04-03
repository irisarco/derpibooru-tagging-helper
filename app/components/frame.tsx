import clsx from "clsx";
import React from "react";

export type FrameProps = React.ComponentPropsWithoutRef<"div">;

export const Frame: React.FC<FrameProps> = ({ ...props }) => {
  return (
    <div
      {...props}
      className={clsx(
        "flex min-h-[8em] flex-wrap content-start gap-5px border border-[#5f636a] bg-[#1d242f] p-5px",
        props.className
      )}
    />
  );
};
