import * as React from "react";
import styles from "./Course.module.scss";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { toast } from "sonner";
import * as dataApi from "../../api/apiService/dataService";
import { Link, useParams,useNavigate  } from "react-router-dom";
const CurriculumItem = ({ item, index, isHighlighted }) => {
    const handleOpenSubLesson = () => {
        const sub = document.getElementById(index);
        sub.classList.toggle("disabled");
    };
   
    
    return (
        <div
            className={clsx(styles.curriculumItem, {
                [styles.highlighted]: isHighlighted,
            })}
        >
            <div
                className={clsx(styles.title, "flex  p-2 w-full")}
                onClick={handleOpenSubLesson}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    class="w-6 h-6 mt-1.5"
                >
                    <path
                        fill-rule="evenodd"
                        d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z"
                        clip-rule="evenodd"
                    />
                </svg>
                <div
                    className={clsx(
                        styles.curriculumItemTitle,
                        "flex w-full justify-between"
                    )}
                >
                    <div className="w-3/4 line-clamp-2">{item.title}</div>
                    <div className={clsx(styles.subTitle)}>
                        {item.lessons.length} lectures
                    </div>
                </div>
            </div>

            <div
                id={index}
                className={clsx(styles.wrapLesson, "w-full py-2.5 disabled")}
            >
                {item.lessons &&
                    item.lessons.map((lesson, ind) => {
                        return (
                            <div
                                key={ind}
                                className={clsx(
                                    styles.lessonItem,
                                    "flex ml-6 gap-6 py-2"
                                )}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke-width="1.5"
                                    stroke="currentColor"
                                    class="w-5 h-6"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125M3.375 19.5h1.5C5.496 19.5 6 18.996 6 18.375m-3.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-1.5A1.125 1.125 0 0 1 18 18.375M20.625 4.5H3.375m17.25 0c.621 0 1.125.504 1.125 1.125M20.625 4.5h-1.5C18.504 4.5 18 5.004 18 5.625m3.75 0v1.5c0 .621-.504 1.125-1.125 1.125M3.375 4.5c-.621 0-1.125.504-1.125 1.125M3.375 4.5h1.5C5.496 4.5 6 5.004 6 5.625m-3.75 0v1.5c0 .621.504 1.125 1.125 1.125m0 0h1.5m-1.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m1.5-3.75C5.496 8.25 6 7.746 6 7.125v-1.5M4.875 8.25C5.496 8.25 6 8.754 6 9.375v1.5m0-5.25v5.25m0-5.25C6 5.004 6.504 4.5 7.125 4.5h9.75c.621 0 1.125.504 1.125 1.125m1.125 2.625h1.5m-1.5 0A1.125 1.125 0 0 1 18 7.125v-1.5m1.125 2.625c-.621 0-1.125.504-1.125 1.125v1.5m2.625-2.625c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125M18 5.625v5.25M7.125 12h9.75m-9.75 0A1.125 1.125 0 0 1 6 10.875M7.125 12C6.504 12 6 12.504 6 13.125m0-2.25C6 11.496 5.496 12 4.875 12M18 10.875c0 .621-.504 1.125-1.125 1.125M18 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m-12 5.25v-5.25m0 5.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125m-12 0v-1.5c0-.621-.504-1.125-1.125-1.125M18 18.375v-5.25m0 5.25v-1.5c0-.621.504-1.125 1.125-1.125M18 13.125v1.5c0 .621.504 1.125 1.125 1.125M18 13.125c0-.621.504-1.125 1.125-1.125M6 13.125v1.5c0 .621-.504 1.125-1.125 1.125M6 13.125C6 12.504 5.496 12 4.875 12m-1.5 0h1.5m-1.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M19.125 12h1.5m0 0c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h1.5m14.25 0h1.5"
                                    />
                                </svg>
                                <span>{lesson.title}</span>
                            </div>
                        );
                    })}
            </div>
        </div>
    );
};

const CourseDetails = ({ course, expanded }) => (
    <div
        className={clsx(styles.courseDetailsWrapper, "b-shadow", {
            [styles.expanded]: expanded,
        })}
    >
        <h3 className={styles.courseDetailsTitle}>Curriculum</h3>
        <div className={styles.courseCurriculum}>
            {course.sections.map((item, index) => (
                <>
                    <CurriculumItem
                        key={index}
                        item={item}
                        isHighlighted={index % 2 === 0}
                    />
                </>
            ))}
        </div>
    </div>
);


function Course() {
    const userInfo = useSelector((state) => state.login.user);
    const { id } = useParams(); // Course ID from the route
    const [course, setCourse] = useState(null);
    const [totalLessons, setTotalLessons] = useState(0);
    const [currentUser, setCurrentUserId] = useState(null);
    const navigate = useNavigate();
    console.log(userInfo)
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
                setCurrentUserId(userId);
            } catch (error) {
                console.error("Failed to fetch user ID", error);
                toast.error("Failed to fetch user information. Please try again.");
            }
        };
    
        fetchUserId();
    }, []);
    
    
    // Fetch course details
    useEffect(() => {
        const fetchCourseDetails = async () => {
            try {
                const courseData = await dataApi.getCourseById(id);
                console.log("Fetched course data:", courseData);
    
                const sections = courseData?.data?.sections || [];
                const lessonCount = sections.reduce((acc, section) => acc + (section.lessons?.length || 0), 0);
    
                setTotalLessons(lessonCount);
                console.log(courseData.content)
                setCourse(courseData.content); // Update course state
            } catch (error) {
                toast.error("Failed to fetch course details");
                console.error("Error fetching course:", error);
            }
        };
    
        fetchCourseDetails();
    }, [id]);
    
    
    // Handle enrollment
    const handleEnroll = async () => {
        if (!userInfo) {
            toast.error("Please log in to enroll in the course.");
            console.error("Current user is null.");
            return;
          }
        
          try {
            console.log("Enrolling user:", userInfo.email, "in course:", id);
            const enrollData = {
              email: userInfo.email,
              courseId: id,
              lessonIds: [], // Start with an empty list or pass initial lesson IDs if any
            };
            const response = await dataApi.enrollInCourse(enrollData);
            toast.success("Enrolled successfully!");
            // Optionally, navigate to the course detail page
            navigate(`/course/detail/${id}`);
          } catch (error) {
            toast.error("Failed to enroll in the course");
            console.error("Error during enrollment:", error);
          }
    };

    if (!course) {
        return <div>Loading...</div>;
    }


    return (
        <div className={clsx(styles.detailsContainer)}>
            <div className={styles.courseCard}>
                <div className={clsx(styles.content, "row")}>
                    <div
                        className={clsx(
                            styles.courseDetailsWrapper,
                            " col-lg-8"
                        )}
                    >
                        <div
                            className={clsx(
                                styles.courseHeader,
                                styles.someOtherCondition &&
                                    styles.additionalClass
                            )}
                        >
                            <div className={styles.courseInfo}>
                                <h2 className={styles.courseTitle}>
                                    {course.title}
                                </h2>
                                <p className={styles.courseDescription}>
                                    {course.description}
                                </p>
                            </div>
                        </div>
                        <div className={styles.courseMeta}>
                            <div className={styles.tags}>
                                Tags:{" "}
                                {course &&
                                    course.categories &&
                                    course.categories.length > 0 &&
                                    course.categories.map((ca, index) => {
                                        return (
                                            <div
                                                key={index}
                                                className={styles.courseLevel}
                                            >
                                                {ca.name}
                                            </div>
                                        );
                                    })}
                            </div>
                        </div>
                        <div
                            className={clsx(
                                styles.curriculumTitle,
                                "font-semibold"
                            )}
                        >
                            Curriculum
                        </div>

                        <div className={styles.courseCurriculum}>
                            {course.sections &&
                                course.sections.map((item, index) => (
                                    <CurriculumItem
                                        key={index}
                                        index={index}
                                        item={item}
                                    />
                                ))}
                        </div>
                    </div>
                    <div className={clsx("col-lg-4")}>
                        <div
                            className={clsx(
                                styles.sticky,
                                "mx-2 b-shadow rounded-lg"
                            )}
                        >
                            <div className={clsx(styles.courseImages)}>
                                <video
                                    key={course.video}
                                    controls
                                    className="w-full"
                                >
                                    <source
                                        src={course.video}
                                        type="video/mp4"
                                    />
                                </video>
                            </div>
                            <div className={styles.courseDetails}>
                                <div className="my-3">
                                    <div className={clsx(styles.coursePrice)}>
                                        {course.price !== 0
                                            ? "Price: " +
                                              course.price.toLocaleString(
                                                  "vi-VN"
                                              ) +
                                              " VND"
                                            : "Free Course"}
                                    </div>
                                    <Link
                                    onClick={handleEnroll}
                                    className={clsx(styles.courseCta, "w-full")}
                                >
                                    Enroll Now
                                </Link>

                                </div>
                                <div
                                    className={clsx("text-base font-semibold")}
                                >
                                    This course includes:{" "}
                                </div>
                                <div>
                                    <div className={clsx(styles.detailItem)}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke-width="1.5"
                                            stroke="currentColor"
                                            class="w-6 h-6"
                                        >
                                            <path
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v16.5c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Zm3.75 11.625a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
                                            />
                                        </svg>

                                        <span>
                                            Detailed and in-depth knowledge
                                        </span>
                                    </div>
                                    <div className={clsx(styles.detailItem)}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke-width="1.5"
                                            stroke="currentColor"
                                            class="w-6 h-6"
                                        >
                                            <path
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5"
                                            />
                                        </svg>

                                        <span>Dedicated lecturer</span>
                                    </div>
                                    <div className={clsx(styles.detailItem)}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke-width="1.5"
                                            stroke="currentColor"
                                            class="w-6 h-6"
                                        >
                                            <path
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125M3.375 19.5h1.5C5.496 19.5 6 18.996 6 18.375m-3.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-1.5A1.125 1.125 0 0 1 18 18.375M20.625 4.5H3.375m17.25 0c.621 0 1.125.504 1.125 1.125M20.625 4.5h-1.5C18.504 4.5 18 5.004 18 5.625m3.75 0v1.5c0 .621-.504 1.125-1.125 1.125M3.375 4.5c-.621 0-1.125.504-1.125 1.125M3.375 4.5h1.5C5.496 4.5 6 5.004 6 5.625m-3.75 0v1.5c0 .621.504 1.125 1.125 1.125m0 0h1.5m-1.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m1.5-3.75C5.496 8.25 6 7.746 6 7.125v-1.5M4.875 8.25C5.496 8.25 6 8.754 6 9.375v1.5m0-5.25v5.25m0-5.25C6 5.004 6.504 4.5 7.125 4.5h9.75c.621 0 1.125.504 1.125 1.125m1.125 2.625h1.5m-1.5 0A1.125 1.125 0 0 1 18 7.125v-1.5m1.125 2.625c-.621 0-1.125.504-1.125 1.125v1.5m2.625-2.625c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125M18 5.625v5.25M7.125 12h9.75m-9.75 0A1.125 1.125 0 0 1 6 10.875M7.125 12C6.504 12 6 12.504 6 13.125m0-2.25C6 11.496 5.496 12 4.875 12M18 10.875c0 .621-.504 1.125-1.125 1.125M18 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m-12 5.25v-5.25m0 5.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125m-12 0v-1.5c0-.621-.504-1.125-1.125-1.125M18 18.375v-5.25m0 5.25v-1.5c0-.621.504-1.125 1.125-1.125M18 13.125v1.5c0 .621.504 1.125 1.125 1.125M18 13.125c0-.621.504-1.125 1.125-1.125M6 13.125v1.5c0 .621-.504 1.125-1.125 1.125M6 13.125C6 12.504 5.496 12 4.875 12m-1.5 0h1.5m-1.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M19.125 12h1.5m0 0c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h1.5m14.25 0h1.5"
                                            />
                                        </svg>

                                        <span>{totalLessons} lessons</span>
                                    </div>
                                    <div className={clsx(styles.detailItem)}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={1.5}
                                            stroke="currentColor"
                                            className="w-6 h-6"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                            />
                                        </svg>
                                        <span>Full lifetime access</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Course;