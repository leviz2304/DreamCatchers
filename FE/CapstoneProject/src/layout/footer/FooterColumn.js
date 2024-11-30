import * as React from "react";

export default function FooterColumn({ title, children }) {
  return (
    <div className="flex flex-col text-sm text-justify w-[200px]">
      <div className="font-medium leading-none text-white uppercase">
        {title}
      </div>
      <div className="flex flex-col items-start self-start mt-5 tracking-normal leading-loose text-gray-400">
        {children}
      </div>
    </div>
  );
}