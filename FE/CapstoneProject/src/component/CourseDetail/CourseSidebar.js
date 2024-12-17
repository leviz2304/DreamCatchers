import * as React from "react";

export default function CourseSidebar() {
  const courseFeatures = [
    { icon: "ext_35-", label: "Course Duration", value: "6 Month" },
    { icon: "ext_36-", label: "Course Level", value: "Beginner and Intermediate" },
    { icon: "ext_37-", label: "Students Enrolled", value: "69,419,618" },
    { icon: "ext_38-", label: "Language", value: "Mandarin" },
    { icon: "ext_39-", label: "Subtittle Language", value: "English" }
  ];

  const courseIncludes = [
    { icon: "ext_40-", text: "Lifetime access" },
    { icon: "ext_41-", text: "30-days money-back guarantee" },
    { icon: "ext_42-", text: "Free exercises file & downloadable resources" },
    { icon: "ext_43-", text: "Shareable certificate of completion" },
    { icon: "ext_44-", text: "Access on mobile , tablet and TV" },
    { icon: "ext_45-", text: "English subtitles" },
    { icon: "ext_46-", text: "100% online course" }
  ];

  return (
    <aside className="flex flex-col justify-center items-center py-6 bg-white border border-gray-200 border-solid shadow-lg min-w-[240px] w-[424px] max-md:max-w-full">
      <div className="flex flex-col max-w-full w-[376px]">
        <div className="flex gap-10 justify-between items-center w-full max-w-[376px]">
          <div className="flex gap-2 items-center self-stretch my-auto whitespace-nowrap">
            <div className="self-stretch my-auto text-2xl leading-none text-neutral-800">
              $14.00
            </div>
            <div className="self-stretch my-auto text-base text-gray-400">
              $26.00
            </div>
          </div>
          <div className="gap-2.5 self-stretch px-3 py-2 my-auto text-sm font-medium leading-none text-orange-500 uppercase bg-rose-100">
            56% off
          </div>
        </div>
        
        <div className="flex gap-2 justify-center items-center self-start mt-3 text-sm font-medium tracking-normal leading-none text-red-500">
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/6954f28f6790fde32360ae1782239400a724044acf09cb96ea333003d3527c43?placeholderIfAbsent=true&apiKey=f5b4066cc5864741a5497a6883272285"
            alt=""
            className="object-contain shrink-0 self-stretch my-auto w-5 aspect-square"
          />
          <div className="self-stretch my-auto">
            2 days left at this price!
          </div>
        </div>
      </div>

      <hr className="mt-6 max-w-full bg-gray-200 border border-gray-200 border-solid min-h-[1px] w-[424px]" />

      <div className="flex overflow-hidden flex-col mt-6 max-w-full text-sm tracking-normal leading-loose rounded-md w-[376px]">
        {courseFeatures.map((feature, index) => (
          <div key={index} className="flex gap-10 justify-between items-center mt-4 first:mt-0 w-full max-w-[376px]">
            <div className="flex gap-2 items-center self-stretch my-auto text-neutral-800">
              <img
                loading="lazy"
                src={`http://b.io/${feature.icon}`}
                alt=""
                className="object-contain shrink-0 self-stretch my-auto w-6 aspect-square"
              />
              <div className="self-stretch my-auto">{feature.label}</div>
            </div>
            <div className="self-stretch my-auto text-gray-500">
              {feature.value}
            </div>
          </div>
        ))}
      </div>

      <hr className="mt-6 max-w-full bg-gray-200 border border-gray-200 border-solid min-h-[1px] w-[424px]" />

      <div className="flex flex-col mt-6 max-w-full w-[376px]">
        <h2 className="text-base font-medium leading-none text-neutral-800">
          This course includes:
        </h2>
        <div className="flex flex-col mt-4 text-sm tracking-normal leading-loose text-gray-600">
          {courseIncludes.map((item, index) => (
            <div key={index} className="flex gap-3 items-center mt-3 first:mt-0">
              <img
                loading="lazy"
                src={`http://b.io/${item.icon}`}
                alt=""
                className="object-contain shrink-0 self-stretch my-auto w-6 aspect-square"
              />
              <div className="w-[340px]">{item.text}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col mt-6 max-w-full text-lg font-semibold tracking-normal leading-[56px] w-[376px]">
        <button className="gap-3 self-stretch px-8 w-full text-white capitalize bg-orange-500 max-md:px-5">
          Add to Cart
        </button>
        <button className="gap-3 self-stretch px-8 mt-3 w-full text-orange-500 capitalize bg-rose-100 max-md:px-5">
          Buy now
        </button>
        <div className="flex gap-3 items-start mt-3 text-sm tracking-normal leading-10 text-gray-600 capitalize">
          <button className="gap-3 self-stretch px-4 bg-white border border-gray-200 border-solid w-[182px]">
            Add to wishlist
          </button>
          <button className="gap-3 self-stretch px-4 bg-white border border-gray-200 border-solid w-[182px]">
            Gift Course
          </button>
        </div>
        <div className="mt-3 text-sm tracking-normal leading-loose text-gray-400">
          <span className="font-medium leading-5 text-gray-500">Note:</span>{" "}
          all course have 30-days money-back guarantee
        </div>
      </div>
    </aside>
  );
}