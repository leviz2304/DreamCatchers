import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import * as dataApi from "../../api/apiService/dataService";
import { Link, useParams, useNavigate } from "react-router-dom";

function CurriculumItem({ item }) {
  const [open, setOpen] = useState(false);
  const handleOpenSubLesson = () => {
    setOpen(!open);
  };
  return (
    <div className="border border-gray-200 rounded-lg mb-2">
      <div
        className="flex items-start cursor-pointer px-4 py-3 bg-gray-50 hover:bg-gray-100 transition"
        onClick={handleOpenSubLesson}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`w-5 h-5 mt-1 mr-3 text-gray-500 transform transition-transform ${
            open ? "rotate-180" : "rotate-0"
          }`}
          fill="currentColor"
          viewBox="0 0 16 16"
        >
          <path
            fillRule="evenodd"
            d="M4.22 6.22a.75.75 0 011.06 0L8 8.94l2.72-2.72a.75.75 0 
             111.06 1.06l-3.25 3.25a.75.75 0 
             01-1.06 0L4.22 7.28a.75.75 0 
             010-1.06z"
            clipRule="evenodd"
          />
        </svg>
        <div className="flex justify-between w-full">
          <span className="font-semibold text-gray-700">{item.name}</span>
          <div className="text-sm text-gray-500">{item.lessons.length} lectures</div>
        </div>
      </div>
      {open && (
        <div className="bg-white border-t border-gray-200 py-2">
          {item.lessons.map((lesson, i) => (
            <div
              key={i}
              className="flex items-center ml-8 py-2 text-sm text-gray-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 mr-3 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.375 19.5h17.25m-17.25 
                   0a1.125 1.125 0 
                   01-1.125-1.125M3.375 
                   19.5h1.5C5.496 19.5 6 
                   18.996 6 
                   18.375m-3.75 0V5.625m0 
                   12.75v-1.5c0-.621.504-1.125 
                   1.125-1.125m18.375 2.625V5.625m0 
                   12.75c0 .621-.504 
                   1.125-1.125 
                   1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 
                   3.75h-1.5A1.125 1.125 
                   0 0118 18.375M20.625 
                   4.5H3.375m17.25 0c.621 
                   0 1.125.504 
                   1.125 1.125M20.625 
                   4.5h-1.5C18.504 4.5 
                   18 5.004 18 
                   5.625m3.75 
                   0v1.5c0 .621-.504 
                   1.125-1.125 
                   1.125M3.375 4.5c-.621 
                   0-1.125.504-1.125 
                   1.125M3.375 
                   4.5h1.5C5.496 4.5 6 
                   5.004 6 
                   5.625m-3.75 0v1.5c0 
                   .621.504 
                   1.125 1.125 
                   1.125m0 
                   0h1.5m-1.5 
                   0c-.621 
                   0-1.125.504-1.125 
                   1.125v1.5c0 
                   .621.504 
                   1.125 1.125 
                   1.125m1.5-3.75C5.496 
                   8.25 6 7.746 6 
                   7.125v-1.5"
                />
              </svg>
              <span>{lesson.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Course() {
  const userInfo = useSelector((state) => state.login.user);
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [totalLessons, setTotalLessons] = useState(0);
  const [currentUser, setCurrentUserId] = useState(null);
  const [instructor, setInstructor] = useState(null); // State cho instructor
  const navigate = useNavigate();

  const fetchCurrentUserEmail = () => {
    const user = sessionStorage.getItem("user");
    if (user) {
      const parsedUser = JSON.parse(user);
      return parsedUser.email || "";
    }
    return "";
  };

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const email = fetchCurrentUserEmail();
        if (!email) {
          console.error("No email found in session storage.");
          return;
        }
        const userId = await dataApi.getUserIdByEmail(email);
        setCurrentUserId(userId);
      } catch (error) {
        console.error("Failed to fetch user ID", error);
        toast.error("Failed to fetch user information. Please try again.");
      }
    };
    fetchUserId();
  }, []);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const courseData = await dataApi.getCourseById(id);
        const sections = courseData?.sections || [];
        const lessonCount = sections.reduce(
          (acc, section) => acc + (section.lessons?.length || 0),
          0
        );
        setTotalLessons(lessonCount);
        setCourse(courseData);
      } catch (error) {
        toast.error("Failed to fetch course details");
        console.error("Error fetching course:", error);
      }
    };
    fetchCourseDetails();
  }, [id]);

  // Fetch instructor
  useEffect(() => {
    const fetchInstructor = async () => {
      try {
        const data = await dataApi.getInstructorByCourseId(id);
        setInstructor(data); // data là InstructorDTO
      } catch (error) {
        console.error("Failed to fetch instructor:", error);
      }
    };
    if (id) {
      fetchInstructor();
    }
  }, [id]);

  const handleEnroll = async () => {
    if (!userInfo) {
      toast.error("Please log in to enroll in the course.");
      console.error("Current user is null.");
      return;
    }
  
    try {
      await dataApi.enrollInCourse(id, userInfo.id);
      toast.success("Enrolled successfully!");
      navigate(`/course/detail/${id}`);
    } catch (error) {
      toast.error("Failed to enroll in the course");
      console.error("Error during enrollment:", error);
    }
  };
  

  if (!course) {
    return <div className="text-center py-10">Loading...</div>;
  }

  const rating = 4.8;
  const ratingCount = "8,944 Ratings";
  const studentCount = "29,544 Students";
  const courseLastUpdated = "Last updated 11/2023";
  const language = "English";
  const subtitle = "English";

  const whatYouWillLearn = [
    "Learn how to confidently start, continue, and end conversations in English.",
    "Understand and practice essential expressions for daily communication.",
    "Master key vocabulary related to daily routines, shopping, traveling, and social interactions.",
    "Learn how to use idiomatic expressions and phrasal verbs naturally in conversations.",
    "Practice real-life conversation scenarios with role-plays and dialogues.",
    "Enhance your listening skills to understand different accents and fast speech."
  ];

  return (
    <div className="bg-white mt-14">
      <div className="flex flex-col lg:flex-row gap-8 py-8 px-4 lg:px-16 xl:px-24">
        {/* Left Column */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {course.title}
          </h1>

          <div className="text-sm text-gray-600 mb-6">{courseLastUpdated} • {language} • Subtitle: {subtitle}</div>

          <div className="mb-8">
            <video key={course.videoPreviewUrl} controls className="w-full rounded-lg">
              <source src={course.videoPreviewUrl} type="video/mp4" />
            </video>
          </div>

          <div className="border-b mb-4">
            <nav className="flex space-x-6 text-base font-semibold text-gray-700">
              <button className="pb-2 border-b-2 border-black">Overview</button>
              <button className="pb-2 hover:text-gray-900">Curriculum</button>
              <button className="pb-2 hover:text-gray-900">Instructor</button>
              <button className="pb-2 hover:text-gray-900">Reviews</button>
            </nav>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Description</h2>
            <p className="text-gray-700 text-sm leading-relaxed">
              {course.description}
            </p>
          </div>

          <div className="mb-8 bg-green-100 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">What you will learn in this course</h2>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
              {whatYouWillLearn.map((point, idx) => (
                <div key={idx} className="flex items-start space-x-3">
                  <span className="text-green-600 mt-1">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" 
                      viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" 
                        d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Curriculum</h2>
            <div className="flex items-center text-sm text-gray-600 mb-4">
              <span>{course.sections?.length || 0} sections</span>
              <span className="mx-2">•</span>
              <span>{totalLessons} lectures</span>
              <span className="mx-2">•</span>
              <span>10h total</span>
            </div>
            <div className="w-full flex flex-col gap-4">
              {course.sections &&
                course.sections.map((item, index) => (
                  <CurriculumItem key={index} item={item} />
                ))}
            </div>
          </div>

          {/* Instructor từ API */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Course Instructor</h2>
            {instructor ? (
              <div className="flex space-x-4 items-center">
                <img src={instructor.avatar} alt={instructor.firstName} className="w-12 h-12 rounded-full" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{instructor.firstName} {instructor.lastName}</h3>
                  <div className="text-sm text-gray-600">Instructor</div>
                  {/* Bạn có thể thêm thông tin khác nếu InstructorDTO có */}
                  <p className="text-sm text-gray-700 mt-2 line-clamp-2">{instructor.email}</p>
                </div>
              </div>
            ) : (
              <div>Loading instructor...</div>
            )}
          </div>

          {/* Phần dưới để nguyên nếu muốn */}
          {/* Course Rating */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Course Rating</h2>
            <div className="flex items-center space-x-4 mb-4">
              <span className="text-3xl font-bold text-yellow-500">{rating}</span>
              <span className="text-sm text-gray-700">Course Rating</span>
            </div>
            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex items-center">
                <span className="w-16">5 Star</span>
                <div className="flex-1 bg-gray-200 h-2 relative rounded-full overflow-hidden">
                  <div className="absolute left-0 top-0 h-full bg-yellow-500" style={{width:"90%"}}></div>
                </div>
                <span className="ml-2">90%</span>
              </div>
            </div>
          </div>

          {/* Student Feedback */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Student Feedback</h2>
            <div className="space-y-4">
              <div className="border-b pb-4">
                <div className="flex items-center text-yellow-500">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 14.5l-4.502 2.366.86-5.021L2.5 
                      7.864l5.036-.732L10 2.5l2.464 
                      4.632 5.036.732-3.858 3.981.86 
                      5.021L10 14.5z"/>
                    </svg>
                  ))}
                </div>
                <p className="text-sm text-gray-700 mt-2">
                  "Amazing course! Learnt so much about Figma and Webflow..."
                </p>
                <span className="text-xs text-gray-500">- John Doe</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Sticky Sidebar */}
        <div className="w-full lg:w-1/3 lg:sticky top-8 h-fit">
          <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
            <div className="text-2xl font-bold text-gray-800 mb-4">Free Course</div>
            <button
              onClick={handleEnroll}
              className="w-full bg-orange-500 hover:bg-orange-800 text-white font-medium py-3 transition"
            >
              Enroll Now
            </button>
            <div className="text-xs text-gray-500 mt-6">Lifetime access • Certificate of completion • Access on mobile and TV</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Course;
