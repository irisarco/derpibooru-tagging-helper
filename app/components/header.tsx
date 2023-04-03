import Image from "next/image";
import React from "react";
import { clsx } from "clsx";

export interface HeaderProps {
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({ className }) => {
  return (
    <div className={clsx("text-center", className)}>
      <div className="flex items-center justify-center gap-2 text-2xl">
        <Image
          src="/derpi-logo.svg"
          width={24}
          height={24}
          priority
          alt="Derpibooru logo"
        />
        Derpibooru tagging helper
      </div>
      <span className="text-base">
        by{" "}
        <a
          href="https://irisarco.art"
          target="_blank"
          rel="noopener"
          className="text-[#478acc]"
        >
          irisarco
        </a>
        {" | "}
        <a
          href="https://github.com/irisarco/derpibooru-tagging-helper"
          target="_blank"
          rel="noopener"
          className="text-[#478acc]"
        >
          source code
        </a>
      </span>
    </div>
  );
};
