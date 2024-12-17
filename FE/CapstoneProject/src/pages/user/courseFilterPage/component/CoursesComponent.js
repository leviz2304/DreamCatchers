// import React, { useEffect, useState } from "react";
// import { getCoursesByCategory, getAllCourse, getCourseByName } from "../../../../api/apiService/dataService";
// import { CourseCard } from "../../../../component/ladingComponent/CourseCard";

// const CoursesComponent = ({ filteredCategories, searchTerm, currentPage, onPageChange }) => {
//   const [courses, setCourses] = useState([]);
//   const coursesPerPage = 10; // Number of courses per page

//   useEffect(() => {
//     const fetchCourses = async () => {
//       try {
//         if (searchTerm) {
//           // Search functionality
//           const res = await getCourseByName(searchTerm, currentPage - 1, coursesPerPage);
//           setCourses(res.content.content);
//         } else if (filteredCategories.length > 0) {
//           // Filter by categories
//           const res = await Promise.all(
//             filteredCategories.map((catId) =>
//               getCoursesByCategory(catId, currentPage - 1, coursesPerPage)
//             )
//           );
//           const mergedCourses = res.flatMap((r) => r.content.content);
//           setCourses(mergedCourses);
//         } else {
//           // Get all courses
//           const res = await getAllCourse(currentPage - 1, coursesPerPage);
//           setCourses(res.content.content);
//         }
//       } catch (error) {
//         console.error("Error fetching courses:", error);
//       }
//     };

//     fetchCourses();
//   }, [filteredCategories, searchTerm, currentPage]);

//   return (
//     <div>
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//         {courses.map((course) => (
//           <CourseCard key={course.id} course={course} />
//         ))}
//       </div>
//       <div className="flex justify-center mt-4">
//         <button
//           className="px-4 py-2 border rounded-lg mx-2"
//           onClick={() => onPageChange(currentPage - 1)}
//           disabled={currentPage === 1}
//         >
//           Previous
//         </button>
//         <button
//           className="px-4 py-2 border rounded-lg mx-2"
//           onClick={() => onPageChange(currentPage + 1)}
//         >
//           Next
//         </button>
//       </div>
//     </div>
//   );
// };

// export default CoursesComponent;
