import React from 'react';

const CourseInfoDetails = ({ title, sectionsCount, lecturesCount, duration }) => {
  return (
    <div className="flex flex-col w-full">
      <h2 className="text-xl font-semibold text-neutral-800">
        {title}
      </h2>
      <div className="flex gap-4 items-center mt-2 text-sm text-gray-600">
        <div className="flex items-center gap-1.5">
          {/* Sections Icon */}
          <img src="path/to/sections-icon.svg" alt="" className="w-5 h-5" />
          <span>{sectionsCount} Sections</span>
        </div>
        <div className="flex items-center gap-1.5">
          {/* Lectures Icon */}
          <img src="path/to/lectures-icon.svg" alt="" className="w-5 h-5" />
          <span>{lecturesCount} Lectures</span>
        </div>
        <div className="flex items-center gap-1.5">
          {/* Duration Icon */}
          <img src="path/to/duration-icon.svg" alt="" className="w-5 h-5" />
          <span>{duration}</span>
        </div>
      </div>
    </div>
  );
};

export default CourseInfoDetails;
