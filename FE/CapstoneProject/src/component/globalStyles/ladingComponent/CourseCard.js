import React, { useState, memo, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as dataApi from "../../api/apiService/dataService.js";
import { useSelector } from "react-redux";
import * as userApi from "../../api/apiService/authService.js";
import { toast } from "sonner";
import clsx from "clsx";

function Badge({ keyData, children }) {
    return (
        <div
            key={keyData}
            className="px-1 py-1 bg-orange-100 text-orange-700 rounded-md text-xs font-semibold uppercase w-10"
        >
            {children}
        </div>
    );
}

export const CourseCard = memo(({ course, textBtn = "Get It Now", courseId = -1 }) => {
    const user = useSelector((state) => state.login.user);
    const navigate = useNavigate();

    const handleGoToCourse = () => {
        if (user) {
            const fetchApi = async () => {
                try {
                    const result = await userApi.getListCourse(user.email);
                    let isEnroll = false;
                    result.content.forEach((progress) => {
                        if (progress.course.id === courseId) {
                            isEnroll = true;
                            navigate(`/course/detail/${courseId}`);
                        }
                    });
                    if (!isEnroll) {
                        navigate(`/course/${courseId}`);
                    }
                } catch (error) {
                    console.log(error);
                }
            };
            fetchApi();
        } else {
            toast.info("Please login to enroll this course");
            sessionStorage.setItem("prevPath", window.location.pathname);
            navigate("/login");
        }
    };

    return (
        <div className="course-card w-full h-full  px-4 mb-8">
        <div className="b-shadow bg-white rounded-lg border border-gray-100 overflow-hidden">
            {/* Phần chứa hình ảnh */}
            <div className="relative">
                <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-40 object-cover"
                />
            </div>
    
            {/* Phần chứa Badge (chuyển xuống dưới) */}
            <div className="px-4 mt-2 h-2">
                {course.categories.length > 0 && (
                    <Badge keyData={course.categories[0].id}>
                        {course.categories[0].name}
                    </Badge>
                )}
            </div>
    
            {/* Nội dung khóa học */}
            <div className="p-4">
                <h3 className="text-md sm:text-lg font-semibold text-neutral-800 mb-2 line-clamp-2">
                    {course.title}
                </h3>
                <div className="flex items-center mb-2 text-yellow-500 text-sm">
                    <span className="mr-1">5.0★</span>
                    <span>{course.rating}</span>
                    <span className="ml-2 text-gray-500 ml-20">{course.students}30000 students</span>
                </div>
                <button
                    type="button"
                    onClick={handleGoToCourse}
                    className="mt-4 w-full px-4 py-2 text-sm font-medium text-white rounded-md bg-orange-500 hover:bg-orange-600 transition"
                >
                    {textBtn}
                </button>
            </div>
        </div>
    </div>
    
    );
});

const CoursesComponent = () => {
    const [courses, setCourses] = useState([]);
    useEffect(() => {
        const fetchApi = async () => {
            try {
                const result = await dataApi.getAllCourse(0, 9999);
                setCourses(result.content.content);
            } catch (error) {
                console.log("error: " + error);
            }
        };
        fetchApi();
    }, []);
    return (
        <section className="p-4 sm:px-5 sm:py-10 mx-auto max-w-[1200px]">
            <div className="flex flex-wrap justify-center">
                {courses &&
                    courses.map((course, index) => (
                        <CourseCard key={index} course={course} courseId={course.id} />
                    ))}
            </div>
        </section>
    );
};

export default CoursesComponent;
