import * as React from "react";

export default function AppDownloadButton({ icon, store }) {
  return (
    <div className="flex gap-3.5 justify-center items-center px-5 py-3 bg-zinc-700 bg-opacity-40">
      <img
        loading="lazy"
        src={icon}
        alt={`${store} icon`}
        className="object-contain shrink-0 self-stretch my-auto w-8 aspect-square"
      />
      <div className="flex flex-col self-stretch my-auto">
        <div className="text-xs leading-none text-neutral-300">
          Download now
        </div>
        <div className="text-base font-medium leading-none text-white">
          {store}
        </div>
      </div>
    </div>
  );
}