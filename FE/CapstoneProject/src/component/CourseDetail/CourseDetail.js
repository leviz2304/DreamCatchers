import * as React from "react";
import CourseHeader from "./CourseHeader";
import CourseVideo from "./CourseVideo";
import CourseNavigation from "./CourseNavigation";
import CourseDescription from "./CourseDescription";
import CourseLearningPoints from "./CourseLearningPoints";
import CourseSidebar from "./CourseSidebar";

export default function CourseDetail() {
  const courseData = {
    title: "Complete Website Responsive Design: from Figma to Webflow to Website Design",
    category: "3 in 1 Course: Learn to design websites with Figma, build with Webflow, and make a living freelancing.",
    breadcrumbs: ["Home", "Development", "Web Development", "Webflow"],
    rating: "4.8",
    students: "451,444",
    instructors: ["Dianne Russell", "Kristin Watson"],
    description: `It gives you a huge self-satisfaction when you look at your work and say, "I made this!"...`, // Full description text here
    learningPoints: [
      "You will learn how to design beautiful websites using Figma...",
      "You will learn how to take your designs and build them...",
      "You will learn secret tips of Freelance Web Designers...",
      "Learn to use Python professionally...",
      "Understand how to use both the Jupyter Notebook...",
      "Get an understanding of how to create GUIs..."
    ]
  };

  return (
    <div className="flex overflow-hidden flex-col pt-36 bg-white max-md:pt-24">
      <div className="flex w-full bg-slate-100 min-h-[380px] max-md:max-w-full" />
      <div className="flex z-10 flex-wrap gap-6 justify-center items-start px-72 py-20 mt-0 max-md:px-5 max-md:mt-0 max-md:max-w-full">
        <div className="flex flex-col min-w-[240px] w-[872px] max-md:max-w-full">
          <CourseHeader {...courseData} />
          <CourseVideo />
          <CourseNavigation />
          <CourseDescription description={courseData.description} />
          <CourseLearningPoints points={courseData.learningPoints} />
        </div>
        <CourseSidebar />
      </div>
    </div>
  );
}