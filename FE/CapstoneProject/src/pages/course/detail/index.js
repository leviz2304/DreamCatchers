import React, { Fragment, useEffect, useState,useRef } from "react"; // This imports the useState hook
import styles from "./DetailCourse.module.scss";
import { Link, useParams } from "react-router-dom";
import clsx from "clsx";
import * as userApi from "../../../api/apiService/authService.js";
import * as dataApi from "../../../api/apiService/dataService";

import logoPage from "../../../assets/images/logo.png";
import { useSelector } from "react-redux";
import Comment from "../../../component/comment/index.js";
import { comma } from "postcss/lib/list";
import Header from "../../../layout/header"
import CourseInfo from "../../../component/LearningComponent/CourseInfo.js";
import button from "../../../assets/images/Button.png"
import folder from "../../../assets/images/FolderNotchOpen.svg"
import lecture from "../../../assets/images/PlayCircle.svg"
let timerId = null;
const debounce = (func, delay = 1000) => {
    return () => {
        clearTimeout(timerId);
        timerId = setTimeout(() => {
            func();
        }, delay);
    };
};
const CourseHero = ({ video, thumbnail, lessonId, onProgressUpdate }) => {
    const videoRef = useRef();
    const hasSentProgress = useRef(false);
    const userInfo = useSelector((state) => state.login.user);
    const userId = userInfo.id; // Assuming the user ID is stored here
  console.log(userId)
    useEffect(() => {
      hasSentProgress.current = false; // Reset when video changes
    }, [lessonId]);
  
    useEffect(() => {
      const videoElement = videoRef.current;
      // console.log(videoElement.currentTime)
      if (!videoElement) return;
      const fetchCurrentUserEmail = () => {
        const user = sessionStorage.getItem("user");
        if (user) {
            const parsedUser = JSON.parse(user);
            return parsedUser.email || ""; // Return email if available
        }
        return ""; // Return an empty string if no user is found
    }
    
      const handleLoadedMetadata = () => {
        const handleTimeUpdate = async () => {
          const email = fetchCurrentUserEmail();
          if (!email) {
              console.error("No email found in session storage.");
              return;
          }

          const userId = await dataApi.getUserIdByEmail(email);
          if (videoElement.duration) {
            const progress = (videoElement.currentTime / videoElement.duration) * 100;
    
            if (progress >= 80 && !hasSentProgress.current) {
              hasSentProgress.current = true;
    
              // Send progress to backend
              userApi.updateLessonProgress(userId, lessonId, progress)
                .then(() => {
                  onProgressUpdate && onProgressUpdate();
                })
                .catch(error => {
                  console.error('Error updating progress:', error);
                });
            }
          }
        };
    
        videoElement.addEventListener('timeupdate', handleTimeUpdate);
    
        // Cleanup
        return () => {
          videoElement.removeEventListener('timeupdate', handleTimeUpdate);
        };
      };
    
      videoElement.addEventListener('loadedmetadata', handleLoadedMetadata);
    
      // Cleanup
      return () => {
        videoElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
      };
    }, [lessonId, userId, onProgressUpdate]);
  
    // Existing logic for video URL
    let videoUrl = video;
  
    if (!video.startsWith("https://res.cloudinary.com")) {
      var parts = video.split("/");
      var videoId = parts[parts.length - 1].split("?")[0];
      videoUrl = `https://www.youtube.com/embed/${videoId}`;
    }
  
    return (
      <section className={styles.courseHero}>
        {video.startsWith("https://res.cloudinary.com") && video !== "" && (
          <video
            key={video}
            controls
            className="cursor-pointer h-[500px] w-full object-contain bg-black outline-none"
            ref={videoRef}
          >
            <source src={video} type="video/mp4" />
          </video>
        )}
        {!video.startsWith("https://res.cloudinary.com") && video !== "" && (
          <iframe
            title="Video"
            src={videoUrl}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className={styles.videoPlayer}
          ></iframe>
        )}
        {video === "" && <img src={thumbnail} alt="Course thumbnail" />}
      </section>
    );
  };

const CourseHeader = ({titleHeader, lastUpdate, commentTotal, watchingCount }) => {
    return (
        <section className={clsx(styles.titleHeader)}>
            <div className={clsx(styles.textHeader)}>{titleHeader}</div>

        </section>
    )
}
const CouseDetails = ({Description, Notes, AttachFiles}) => {

}

const initFormData = {
    course: {
        title: "",
        desc: "",
        price: "",
        thumbnail: "",
        date: "",
        categories: [],
    },
};
const CurriculumItem = ({
    active,
    section,
    aliasEmail,
    sectionId,
    courseId,
    isHighlighted,
    currentProgress,
    handleVideoSelect,
    setCurrentProgress,
    isLessonUnlocked, // New prop

}) => {
    const handleOpenSubLesson = (e) => {
        const sub = document.getElementById(`section${sectionId}`);
        sub.classList.toggle("disabled");
        e.currentTarget.classList.toggle(styles.active);
    };
    let newUpdate = currentProgress;

    const handleChecked = (e) => {
        const id = parseInt(e.target.id, 10);
        if (e.target.checked && !currentProgress.includes(id)) {
            newUpdate = [...newUpdate, id];
        } else {
            newUpdate = [...newUpdate.filter((item) => item !== id)];
        }

        setCurrentProgress((prev) => newUpdate);

        const fetchUpdateLessonIds = async () => {
            try {
                const result = await userApi.updateLessonIds(
                    aliasEmail,
                    courseId,
                    newUpdate
                );
            } catch (error) {
                console.log(error);
            }
        };
        const debounceAPi = debounce(fetchUpdateLessonIds, 500);
        debounceAPi();
    };

    return (
        <div className={clsx(styles.curriculumItem, {})}>
            <div
                className={clsx(
                    styles.title,
                    "flex cursor-pointer p-2 w-full",
                    {
                        [styles.active]: active === 0,
                    }
                )}
                onClick={(e) => handleOpenSubLesson(e)}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    className={clsx(styles.transfrom, "w-6 h-6 mt-1.5")}
                >
                    <path
                        fillRule="evenodd"
                        d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z"
                        clipRule="evenodd"
                    />
                </svg>
                <div
                    className={clsx(
                        styles.curriculumItemTitle,
                        "flex w-full justify-between"
                    )}
                >
                    <div className="w-3/4 line-clamp-2 flex-1">
                        {section.title}
                    </div>
                </div>
            </div>

            <div
        id={`section${sectionId}`}
        className={clsx(styles.wrapLesson, "w-full", {
          disabled: active !== 0,
        })}
      >
        {section.lessons &&
          section.lessons.map((lesson, ind) => {
            const unlocked = isLessonUnlocked(lesson.id);
            return (
              <div
                key={ind}
                onClick={() => unlocked && handleVideoSelect(lesson)}
                className={clsx(
                    styles.lessonItem,
                    {
                      [styles.highlighted]: lesson.id === isHighlighted,
                      [styles.unlocked]: unlocked,
                      [styles.locked]: !unlocked,
                    }
                  )}
              >
                <div className="checkbox-wrapper ml-3">
                  <label>
                    <input
                      checked={currentProgress.includes(lesson.id)}
                      id={lesson.id}
                      type="checkbox"
                      onChange={handleChecked}
                      disabled={!unlocked}
                    />
                    <span className="checkbox"></span>
                  </label>
                </div>

                <span>{lesson.title}</span>
                {!unlocked && (
                  <span className="ml-auto text-sm text-red-500">Locked</span>
                )}
              </div>
            );
          })}
      </div>
    </div>
    );
};
function DetailCourse() {
    const userInfo = useSelector((state) => state.login.user);
    const alias = userInfo.email.split("@")[0];
    const [currentVideoUrl, setCurrentVideoUrl] = useState("");
    const [lessonSelected, setLessonSelected] = useState({
        id: "",
    });
    const [lessonId, setLessonId] = useState(null);

    const [totalDuration, setTotalDuration] = useState(0);

    const [totalLesson, setTotalLesson] = useState(0);
    const [currentProgress, setCurrentProgress] = useState([]);
    const [progressObject, setProgressObject] = useState(initFormData);
    const [openModal, setOpenModal] = useState(false);
    const [userProgress, setUserProgress] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);

    const { id } = useParams();
    const handleCloseComment = () => {
        setOpenModal(false);
    };
    const fetchCurrentUserEmail = () => {
        const user = sessionStorage.getItem("user");
        if (user) {
            const parsedUser = JSON.parse(user);
            return parsedUser.email || ""; // Return email if available
        }
        return ""; // Return an empty string if no user is found
    };
    // Fetch user ID from the server
    useEffect(() => {
        const fetchUserId = async () => {
            try {
                const email = fetchCurrentUserEmail();
                if (!email) {
                    console.error("No email found in session storage.");
                    return;
                }
    
                const userId = await dataApi.getUserIdByEmail(email);
                console.log("Returned user ID:", userId); 
                setCurrentUser(userId);
                console.log("Trong"+currentUser)
            } catch (error) {
                console.error("Failed to fetch user ID", error);
            }
        };
    
        fetchUserId();
    }, []);
    
    const handleOpenComment = () => {
        setOpenModal(true);
    };

    const handleVideoSelect = (lesson) => {
        if (lesson.video !== "" && lesson.linkVideo === "") {
          setCurrentVideoUrl(lesson.video);
        } else {
          setCurrentVideoUrl(lesson.linkVideo);
        }
        setLessonSelected(lesson);
      };
    const formatDuration = (totalMinutes) => {
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        if (hours > 0 && minutes > 0) {
          return `${hours}h ${minutes}m`;
        } else if (hours > 0) {
          return `${hours}h`;
        } else {
          return `${minutes}m`;
        }
      };
      
    useEffect(() => {
        const fetchApi = async () => {
            try {
                const data = await userApi.getProgress(alias, id);
                let total = 0;
                const lessonFirst = data.content.course.sections[0].lessons[0];
                console.log(lessonFirst)
                const video = lessonFirst.video;
                const linkVideo = lessonFirst.linkVideo;

                data.content.course.sections.map(
                    (section) => (total += section.lessons.length)
                );
                if (data.content.lessonIds !== null) {
                    setCurrentProgress(data.content.lessonIds);
                }

                setLessonSelected(lessonFirst);
                setCurrentVideoUrl(video ? video : linkVideo);
                setLessonId(lessonFirst.id); // Set lessonId directly

                setProgressObject(data.content);
                setTotalLesson(total);
                console.log('LessonSelected:', lessonSelected);
                console.log('LessonSelected.id:', lessonSelected.id);
            } catch (error) {}
        };

        fetchApi();
        if (window.location.pathname.includes("openComment")) {
            setOpenModal(true);
        }
    }, [id, alias]);
    useEffect(() => {
        if (lessonSelected && lessonSelected.id) {
            console.log('LessonSelected updated:', lessonSelected);
            console.log('LessonSelected.id:', lessonSelected.id);
        }
    }, [lessonSelected]);
    useEffect(() => {
        const fetchUserId = async () => {
            try {
                const email = fetchCurrentUserEmail();
                if (!email) {
                    console.error("No email found in session storage.");
                    return;
                }
    
                const userId = await dataApi.getUserIdByEmail(email);
                console.log("Returned user ID:", userId); 
                setCurrentUser(userId);
                console.log("Trong"+currentUser)
            } catch (error) {
                console.error("Failed to fetch user ID", error);
            }
        };
        const fetchUserProgress = async () => {
          try {
            const email = fetchCurrentUserEmail();
                if (!email) {
                    console.error("No email found in session storage.");
                    return;
                }
    
                const userId = await dataApi.getUserIdByEmail(email);
                // console.log("Returned user ID:", userId); 
                // setCurrentUser(userId);
                // console.log("Trong"+currentUser)
            // console.log("test"+currentUser)
            const data = await userApi.getUserProgressForCourse(userId, id);
            console.log(data)
            setUserProgress(data);
          } catch (error) {
            console.error("Error fetching user progress:", error);
          }
        };
        fetchUserId();
        fetchUserProgress();
      }, [currentUser, id]);
      const isLessonUnlocked = (lessonId) => {
        if (userProgress.length === 0) {
          // Only the first lesson is unlocked by default
          return lessonId === progressObject.course.sections[0].lessons[0].id;
        }
        const progress = userProgress.find((lp) => lp.lessonId === lessonId);
        return progress ? progress.unlocked : false;
      };
    
      // Update progress when video progress updates
      const handleProgressUpdate = () => {
        // Refresh user progress
        userApi.getUserProgressForCourse(currentUser, id)
          .then((data) => {
            setUserProgress(data);
          })
          .catch((error) => {
            console.error("Error refreshing user progress:", error);
          });
      };
    useEffect(() => {
        const fetchApi = async () => {
          try {
            const data = await userApi.getProgress(alias, id);
            let totalLessons = 0;
            let totalTime = 0;
            data.content.course.sections.forEach((section) => {
              totalLessons += section.lessons.length;
              section.lessons.forEach((lesson) => {
                totalTime += lesson.duration || 0; // Assuming duration is in minutes
              });
            });
            setTotalLesson(totalLessons);
            setTotalDuration(totalTime);
            setProgressObject(data.content);
            // Rest of your code...
          } catch (error) {}
        };
        fetchApi();
      }, [id, alias]);
      
    return (
        <div className={clsx(styles.wrapperPage)}>
            {/* <div
                className={clsx(
                    styles.headerPage,
                    "flex items-center justify-between b-shadow"
                )}
            >
                <Link to={"/"} className={clsx(styles.logoPage)}>
                    <img src={logoPage} alt="" />
                </Link>
                <h5 className="mb-0 text-center">
                    {progressObject.course.title}
                </h5>
                <div className={clsx(styles.progress)}>
                    Progress: {currentProgress.length}/{totalLesson}
                </div>
            </div> */}
            <Header/>
              {/* Course Header */}
      <div className="bg-gray-50 mt-20">
        <div className="flex items-center h-16 px-8">
          <img src={button} className="h-14 w-14 cursor-pointer" alt="Button Icon" />
          <div className="ml-4">
            <h4 className="text-4xl font-semibold">{progressObject?.course.title}</h4>
            <div className="text-sm text-gray-600 flex items-center mt-1">
              <img src={folder} className="mr-2" alt="Folder Icon" />
              {totalLesson} lectures • {formatDuration(totalDuration)}
            </div>
          </div>
        </div>
      </div>
            <main className={clsx(styles.uiUxCourse)}>
                <div className={clsx(styles.sectionVideo, "w-[90%] h-[600px]")}>
                    <div className={clsx("row", "mx-0")}>
                        <div
                            className={clsx(styles.videoContainer, "col-lg-9")}
                        >
                            <CourseHero
                                video={currentVideoUrl}
                                thumbnail={progressObject.course.thumbnail}
                                lessonId={lessonSelected.id}
                                onProgressUpdate={handleProgressUpdate}
                            />
{/* 
                            <CourseHeader
                                titleHeader={progressObject.course.title}

                            /> */}
                        

                            {/* //!------------ NOTE ----------------*/}
                            {/* <button
                                className={clsx(
                                    styles.sectionComment,
                                    "btnLGBT"
                                )}
                                onClick={handleOpenComment}
                            >
                                <div className="flex gap-2">
                                    Discussion
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
                                        stroke="currentColor"
                                        className="w-5 h-5"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.068.157 2.148.279 3.238.364.466.037.893.281 1.153.671L12 21l2.652-3.978c.26-.39.687-.634 1.153-.67 1.09-.086 2.17-.208 3.238-.365 1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
                                        />
                                    </svg>
                                </div>
                            </button> */}

                            {/* <div
                                className={clsx(styles.sectionComment)}
                                onClick={handleOpenComment}
                            ></div> */}
                            {/* //!------------ NOTE ----------------*/}
                        </div>
                        <div
                            className={clsx(
                                styles.courseSectionsContainer,
                                "col-lg-3"
                            )}
                        >
                            <section className={styles.courseSection}>
                                <div className={clsx(styles.sectionHeader)}>
                                    <div className={styles.sectionNumber}>
                                        Curriculum
                                    </div>
                                </div>
                                <div className={styles.courseCurriculum}>
                                    {progressObject.course.sections &&
                                        progressObject.course.sections.map(
                                            (section, index) => (
                                                <CurriculumItem
                                                    active={index}
                                                    setCurrentProgress={
                                                        setCurrentProgress
                                                    }
                                                    courseId={id}
                                                    currentProgress={
                                                        currentProgress
                                                    }
                                                    aliasEmail={alias}
                                                    isHighlighted={
                                                        lessonSelected.id
                                                    }
                                                    handleVideoSelect={
                                                        handleVideoSelect
                                                    }
                                                    sectionId={index}
                                                    key={index}
                                                    section={section}
                                                    isLessonUnlocked={isLessonUnlocked}

                                                />
                                            )
                                        )}
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
               
                {/* {openModal && (
                    <Comment
                        courseId={id}
                        lessonId={lessonSelected.id}
                        openModal={openModal}
                        funcCloseModal={handleCloseComment}
                    ></Comment>
                )} */}
                
            </main>
            <div className="h-14 mt-10 bg-white ml-28">
        <h3 className="text-black">
          {lessonSelected.title}
        </h3>
      </div>
      <div className="w-[800px] ml-28">
      {lessonId && (
    <Comment
        courseId={id}
        lessonId={lessonId}
    />
)}
      </div>
 
    </div>
    );
}

export default DetailCourse;
