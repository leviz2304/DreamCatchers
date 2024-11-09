import React, { memo, useEffect, useState } from "react";
import styles from "./userCourses.module.scss";
import clsx from "clsx";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import * as userApi from "../../../api/apiService/authService";
import Footer from "../../../layout/footer";

function Badge({ children }) {
    return (
        <div className="flex justify-center px-2.5 py-1 bg-white rounded-md border border-gray-500 border-solid text-xs ">
            {children}
        </div>
    );
}
export const CourseCard = memo(
    ({ course, textBtn = "Go to learn", courseId = -1 }) => {
        return (
            <div className="course-card w-full col-lg-3 px-4 flex flex-col mb-7">
                <div className="b-shadow bg-white rounded-xl border border-gray-100 p-6 flex flex-col">
                    <div className="flex justify-center">
                        <img
                            loading="lazy"
                            src={course.thumbnail}
                            alt=""
                            className="course-image w-full rounded-t-lg mb-4  object-cover"
                        />
                    </div>
                    <div className="flex justify-start space-x-2 mb-2">
                        {course.categories.map((category) => (
                            <Badge key={category.id}>{category.name}</Badge>
                        ))}
                    </div>
                    <h3 className="text-md sm:text-lg font-semibold text-neutral-800 mb-2  text-start">
                        {course.title}
                    </h3>

                    <Link
                        to={`/course/detail/${course.id}`}
                        className="px-4 py-2 text-xs sm:text-sm font-medium text-center rounded-md border border-gray-100 bg-neutral-100 text-neutral-800"
                    >
                        {textBtn}
                    </Link>
                </div>
            </div>
        );
    }
);

const MyCourses = () => {
    const user = useSelector((state) => state.login.user);
    const [courses, setCourses] = useState([]);
    useEffect(() => {
        const fetchApi = async () => {
            try {
                const result = await userApi.getUserByEmail(user.email);
                let listCourse = [];
                result.content.progresses.forEach((pro) => {
                    listCourse.push(pro.course);
                });
                setCourses(listCourse);
            } catch (error) {
                console.log(error);
            }
        };

        fetchApi();
    }, []);

    return (
        <div className={clsx("bg-neutral-100")}>
            <div className={clsx(styles.header)}>
                <div className="container">
                    <h1 className={clsx("uppercase font-extrabold")}>
                        My courses
                    </h1>
                </div>
            </div>
            <div className={clsx(styles.wrapContent, "container mt-6")}>
                <div>
                    {courses?.length > 0 ? (
                        courses.map((course, ind) => (
                            <CourseCard
                                key={ind}
                                course={course}
                                courseId={course.id}
                            />
                        ))
                    ) : (
                        <div className="font-base font-semibold">
                            You have not enroll for any courses yet
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default MyCourses;
