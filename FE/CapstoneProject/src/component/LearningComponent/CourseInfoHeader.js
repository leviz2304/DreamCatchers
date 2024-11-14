import React from 'react';
import { useNavigate } from 'react-router-dom';

const CourseInfoHeader = () => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(-1); // Navigate back to the previous page
  };

  return (
    <div className="flex items-center">
      <button
        onClick={handleBackClick}
        className="flex items-center p-4 bg-white h-14 w-14 rounded-full cursor-pointer"
      >
        <img
          src="path/to/back-icon.svg" // Replace with your back icon
          alt="Back"
          className="w-6 h-6"
        />
      </button>
    </div>
  );
};

export default CourseInfoHeader;
