import * as React from "react";

export default function CourseVideo() {
  return (
    <div className="flex relative flex-col justify-center items-center px-16 py-52 mt-10 w-full max-w-[872px] min-h-[492px] max-md:px-5 max-md:py-24 max-md:max-w-full">
      <img
        loading="lazy"
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/1936fd440259a0cb27c6a7db76972349631b51c360605463640b183792f4d904?placeholderIfAbsent=true&apiKey=f5b4066cc5864741a5497a6883272285"
        alt="Course preview video thumbnail"
        className="object-cover absolute inset-0 size-full"
      />
      <button 
        className="flex relative gap-2.5 items-center p-6 mb-0 bg-white h-[72px] rounded-[120px] w-[72px] max-md:px-5 max-md:mb-2.5"
        aria-label="Play course preview video"
      >
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/84a25116f4a4832987c9c6b2cb830ac4a486e117721f03cbb55ac96a410d6a4d?placeholderIfAbsent=true&apiKey=f5b4066cc5864741a5497a6883272285"
          alt=""
          className="object-contain w-6 aspect-square"
        />
      </button>
    </div>
  );
}