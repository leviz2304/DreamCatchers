import * as React from "react";

export default function CourseDescription({ description }) {
  return (
    <div className="flex flex-col mt-10 max-w-full w-[872px]">
      <h2 className="self-start text-2xl font-semibold tracking-tight leading-none text-center text-neutral-800">
        Description
      </h2>
      <div className="mt-5 text-sm tracking-normal leading-6 text-gray-600 max-md:max-w-full">
        {description}
      </div>
    </div>
  );
}