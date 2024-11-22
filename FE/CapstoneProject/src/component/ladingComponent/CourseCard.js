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

    const handleGoToCourse = async () => {
        // Check if user is logged in
        if (!user) {
            toast.info("Please login to enroll in this course");
            sessionStorage.setItem("prevPath", window.location.pathname);
            navigate("/login");
            return;
        }
    
        // Function to fetch current user email from session storage
        const fetchCurrentUserEmail = () => {
            const userSession = sessionStorage.getItem("user");
            if (userSession) {
                const parsedUser = JSON.parse(userSession);
                return parsedUser.email || ""; // Return email from session storage
            }
            return ""; // Return empty string if no user found
        };
    
        try {
            const email = fetchCurrentUserEmail(); // Retrieve email from session storage
            if (!email) {
                toast.error("Please login to access this course.");
                sessionStorage.setItem("prevPath", window.location.pathname);
                navigate("/login");
                return;
            }
    
            // Fetch the user ID based on email
            const userIdResponse = await dataApi.getUserIdByEmail(email);
            const userId = userIdResponse; // Ensure correct extraction of data
            console.log("Fetched user ID:", userId);
    
            // Check enrollment status
            // const isEnrolledResponse = await dataApi.checkUserEnrollment(userId, courseId);
            // console.log(isEnrolledResponse)
            // const isEnrolled = isEnrolledResponse; // Ensure correct extraction of data
            const isEnrolled=true;
            console.log("Enrollment status:", isEnrolled);
    
            // Navigate based on enrollment status
            if (isEnrolled) {
                toast.success("You are already enrolled in this course. Redirecting...");
                navigate(`/course/detail/${courseId}`);
            } else {
                navigate(`/course/${courseId}`);
            }
        } catch (error) {
            toast.error("Failed to check enrollment status. Please try again.");
            console.error("Error checking enrollment:", error);
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
