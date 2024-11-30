import * as React from "react";

export default function SocialIcon({ icon, alt }) {
  return (
    <div className="flex gap-2.5 items-center p-3.5 bg-zinc-700 bg-opacity-40 h-[46px] w-[46px]">
      <img
        loading="lazy"
        src={icon}
        alt={alt}
        className="object-contain aspect-square w-[18px]"
      />
    </div>
  );
}