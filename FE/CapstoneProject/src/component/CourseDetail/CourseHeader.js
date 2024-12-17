import * as React from "react";

export default function CourseHeader({ title, category, breadcrumbs, rating, students, instructors }) {
  return (
    <div className="flex flex-col w-full max-w-[872px] max-md:max-w-full">
      <div className="flex gap-2 items-center self-start text-sm tracking-normal leading-loose text-gray-500">
        {breadcrumbs.map((crumb, index) => (
          <React.Fragment key={index}>
            <div className="self-stretch my-auto">{crumb}</div>
            {index < breadcrumbs.length - 1 && (
              <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/9ab56f7bac0a5b356fdf628c29bfab01d81bbc7c7b15fb6bbae016c27e6acd41?placeholderIfAbsent=true&apiKey=f5b4066cc5864741a5497a6883272285"
                alt=""
                className="object-contain shrink-0 self-stretch my-auto w-3.5 aspect-square"
              />
            )}
          </React.Fragment>
        ))}
      </div>
      <div className="mt-3 text-3xl font-semibold tracking-tight leading-10 text-neutral-800 max-md:max-w-full">
        {title}
      </div>
      <div className="mt-6 text-xl leading-8 text-gray-600 max-md:max-w-full">
        {category}
      </div>
      <div className="flex flex-wrap gap-10 justify-between items-center mt-6 w-full max-md:max-w-full">
        <div className="flex gap-3 justify-center items-center self-stretch my-auto min-w-[240px]">
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/5a3c15b9a06fe2e6fe0d68a181402f4fb1554473c678dd8b85d4cad2c6fac11f?placeholderIfAbsent=true&apiKey=f5b4066cc5864741a5497a6883272285"
            alt="Instructor avatars"
            className="object-contain shrink-0 self-stretch my-auto w-20 aspect-[1.6]"
          />
          <div className="flex flex-col self-stretch my-auto min-w-[240px]">
            <div className="text-sm tracking-normal leading-loose text-gray-500">
              Created by:
            </div>
            <div className="flex gap-1.5 items-start mt-1 text-base font-medium leading-none text-neutral-800">
              {instructors.map((instructor, index) => (
                <React.Fragment key={index}>
                  <div>{instructor}</div>
                  {index < instructors.length - 1 && <div>•</div>}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
        <div className="flex gap-2 justify-center items-center self-stretch my-auto min-w-[240px]">
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/23cd4f21c00a9b6123c70afa5252f7dcb65e8ea5e055005b36e54a7e2bf4d813?placeholderIfAbsent=true&apiKey=f5b4066cc5864741a5497a6883272285"
            alt="Rating stars"
            className="object-contain shrink-0 self-stretch my-auto aspect-[5] w-[120px]"
          />
          <div className="flex items-center self-stretch my-auto">
            <div className="self-stretch my-auto text-base font-medium leading-none text-neutral-800">
              {rating}
            </div>
            <div className="self-stretch my-auto text-sm tracking-normal leading-loose text-gray-500">
              {" "}({students} Rating)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}