import * as React from "react";

export default function CourseLearningPoints({ points }) {
  return (
    <div className="flex flex-col p-10 mt-10 w-full text-sm tracking-normal leading-6 text-gray-600 bg-green-100 bg-opacity-40 max-w-[872px] max-md:px-5 max-md:max-w-full">
      <h2 className="text-2xl font-semibold tracking-tight leading-none text-neutral-800 max-md:max-w-full">
        What you will learn in this course
      </h2>
      <div className="flex flex-wrap gap-6 items-start mt-5 max-md:max-w-full">
        {points.map((point, index) => (
          <div key={index} className="flex gap-2 items-start min-w-[240px]">
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/4520e9ed9d787a9e4ccdb4fc7e4eb3a24c6c3abb821253ea4b26c9c8831c8cb8?placeholderIfAbsent=true&apiKey=f5b4066cc5864741a5497a6883272285"
              alt=""
              className="object-contain shrink-0 w-6 aspect-square"
            />
            <div className="w-[352px]">{point}</div>
          </div>
        ))}
      </div>
    </div>
  );
}