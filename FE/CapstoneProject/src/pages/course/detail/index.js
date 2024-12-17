// DetailCourse.jsx
import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import * as dataApi from "../../../api/apiService/dataService";
import Header from "../../../layout/header";

import button from "../../../assets/images/Button.png";
import folder from "../../../assets/images/FolderNotchOpen.svg";
import CommentsSection from "../../../component/CommentsSection/index"; // Điều chỉnh đường dẫn nếu cần

const CourseHero = ({ videoUrl, thumbnail, onProgress, lessonSelected }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (!videoRef.current || !lessonSelected) return;

    const video = videoRef.current;
    const handleTimeUpdate = () => {
      if (video.duration) {
        const progress = (video.currentTime / video.duration) * 100;
        onProgress(progress);
      }
    };

    video.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [lessonSelected, onProgress]);

  return (
    <section className="w-full bg-white rounded-lg overflow-hidden">
      {videoUrl ? (
        <video
          key={videoUrl}
          controls
          className="cursor-pointer w-full h-[500px] object-contain bg-black"
          ref={videoRef}
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
      ) : (
        <img
          src={thumbnail}
          alt="Course thumbnail"
          className="w-full h-[500px] object-cover"
        />
      )}
    </section>
  );
};

const CurriculumItem = ({
  section,
  highlightedLessonId,
  onSelectLesson,
  unlockedLessons
}) => {
  const [open, setOpen] = useState(false);
  const toggleOpen = () => setOpen(!open);

  return (
    <div className="mb-4">
      <div
        className="flex items-center cursor-pointer p-2 border-b border-gray-200 justify-between"
        onClick={toggleOpen}
      >
        <div className="flex items-center w-[150px]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`w-5 h-5 transition-transform ${open ? "rotate-180" : ""} mr-2`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
          <span className="font-medium text-gray-700 truncate">{section.name}</span>
        </div>
        <div className="text-sm text-gray-500">{section.lessons.length} Lectures</div>
      </div>
      {open && (
        <div className="pl-8 pt-2">
          {section.lessons &&
            section.lessons.map((lesson) => {
              const isUnlocked = unlockedLessons[lesson.id] === true;
              return (
                <div
                  key={lesson.id}
                  onClick={() => {
                    if (isUnlocked) onSelectLesson(lesson);
                  }}
                  className={`flex items-center p-2 rounded-md mb-2 transition-colors ${
                    lesson.id === highlightedLessonId ? "bg-blue-50" : ""
                  } ${isUnlocked ? "cursor-pointer hover:bg-gray-100" : "cursor-not-allowed opacity-50"}`}
                >
                  <span className="flex-1 truncate text-sm text-gray-700">{lesson.name}</span>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
};

function DetailCourse() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [unlockedLessons, setUnlockedLessons] = useState({});
  const [userId, setUserId] = useState(null);

  // Lấy userId từ session
  useEffect(() => {
    const userStr = sessionStorage.getItem("user");
  if (userStr) {
    const userObj = JSON.parse(userStr);
    // Giả sử userObj có cả 'id' (số nguyên) và 'email'
    const parsedUserId = parseInt(userObj.id, 10);
    if (!isNaN(parsedUserId)) {
      setUserId(parsedUserId);
    } else {
      console.error("Invalid userId:", userObj.id);
      // Có thể sử dụng một trường khác nếu có, ví dụ: userObj.userId
      setUserId(null); // Hoặc xử lý theo cách khác
    }
  }
  }, []);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await dataApi.getCourseById(id); 
        // response.data hoặc response.content tùy vào BE
        // Giả sử response đã qua interceptors -> response là courseDTO
        const courseData = response;
        setCourse(courseData);
      } catch (error) {
        console.error("Failed to fetch course details:", error);
      }
    };
    fetchCourse();
  }, [id]);

  // Lấy trạng thái unlock của các bài học
  useEffect(() => {
    const fetchLessonStatus = async () => {
      if (!userId || !course) return;
      try {
        const data = await dataApi.getLessonsStatus(id, userId);
        const map = {};
        data.forEach((ls) => {
          map[ls.lessonId] = ls.unlocked;
        });
        
        // Đảm bảo bài học đầu tiên luôn mở:
        if (course.sections && course.sections.length > 0 && course.sections[0].lessons && course.sections[0].lessons.length > 0) {
          const firstLessonId = course.sections[0].lessons[0].id;
          // Nếu vì lý do nào đó bài học đầu tiên chưa unlock thì unlock nó
          if (map[firstLessonId] !== true) {
            map[firstLessonId] = true;
          }
        }
  
        setUnlockedLessons(map);
      } catch (error) {
        console.error("Error fetching lessons status:", error);
      }
    };
    fetchLessonStatus();
  }, [id, userId, course]);

  const handleSelectLesson = (lesson) => {
    // Chỉ gọi nếu bài học đã unlocked
    setSelectedLesson(lesson);
  };

  const handleProgress = async (progress) => {
    // Khi progress >=80% và có selectedLesson
    if (progress >= 80 && selectedLesson && userId) {
      try {
        await dataApi.updateLessonProgress(userId, selectedLesson.id, progress, id);
        // Sau khi update progress, gọi lại getLessonsStatus để mở khóa bài tiếp theo
        const data = await dataApi.getLessonsStatus(id, userId);
        const map = {};
        data.forEach((ls) => {
          map[ls.lessonId] = ls.unlocked;
        });
        setUnlockedLessons(map);
      } catch (error) {
        console.error("Error updating progress:", error);
      }
    }
  };

  if (!course) {
    return (
      <div className="pt-20">
        <Header />
        <div className="text-center">Loading course...</div>
      </div>
    );
  }

  const totalLesson = course.sections?.reduce((acc, sec) => acc + sec.lessons.length, 0) || 0;
  const currentVideoUrl = selectedLesson ? selectedLesson.videoUrl : course.videoPreviewUrl;
  const totalDuration = 0;

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />

      <div className="max-w-[1200px] mx-auto pt-20 px-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-4">
            <div>
              <img src={button} className="h-16 w-16" alt="Button Icon" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-gray-800">
                {course.title}
              </h1>
              <div className="text-sm text-gray-600 flex items-center mt-1">
                <img src={folder} className="mr-2 h-5 w-5" alt="Folder Icon" />
                {totalLesson} Lectures • {totalDuration}h total
              </div>
            </div>
          </div>
          <div className="space-x-2">
            <button className="bg-white border border-gray-300 px-4 py-2 rounded hover:bg-gray-100 text-sm">
              Write A Review
            </button>
            <button className="bg-orange-500 text-white px-4 py-2 rounded text-sm hover:bg-orange-600">
              Next Lecture
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-3/4">
            <div className="mb-4">
              <CourseHero
                videoUrl={currentVideoUrl || ""}
                thumbnail={course.thumbnailUrl}
                onProgress={handleProgress}
                lessonSelected={selectedLesson}
              />
            </div>

            <div className="mt-4">
              <h2 className="text-xl font-medium text-gray-800">
                {selectedLesson ? selectedLesson.name : "Course Overview"}
              </h2>
            </div>

            <div className="mt-4 bg-white p-4 rounded shadow text-gray-700">
              <p>{course.description || "No description available."}</p>
            </div>

            <div className="mt-8">
              {/* Comment logic nếu cần */}
              <CommentsSection
                courseId={id} // ID của khóa học
                lessonId={selectedLesson ? selectedLesson.id : null} // ID của bài học đang chọn
              />
            
            </div>
          </div>

          <div className="lg:w-1/4">
            <div className="bg-white rounded shadow p-4 sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-gray-800">
                  Course Contents
                </h4>
                <div className="text-sm text-green-500 font-medium">15% Completed</div>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: "15%" }}></div>
              </div>

              {course.sections &&
                course.sections.map((section, index) => (
                  <CurriculumItem
                    key={index}
                    section={section}
                    highlightedLessonId={selectedLesson?.id}
                    onSelectLesson={handleSelectLesson}
                    unlockedLessons={unlockedLessons}
                  />
                ))}

              <div className="mt-4 border-t pt-4 text-gray-700 text-sm">
                <h5 className="font-semibold mb-2">What's Next?</h5>
                <p>Continue to explore more lectures and improve your skills!</p>
              </div>
            </div>
          </div>
        </div>


      </div>
    </div>
  );
}

export default DetailCourse;
