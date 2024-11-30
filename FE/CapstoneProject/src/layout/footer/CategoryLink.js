import * as React from "react";

export default function CategoryLink({ text }) {
  return (
    <div className="gap-3 self-stretch py-1.5 whitespace-nowrap bg-neutral-800">
      {text}
    </div>
  );
}