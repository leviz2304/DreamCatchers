// import React, { useState } from "react";
// import { useSelector } from "react-redux";
// import FilterSortBar from "./component/FilterSortBar";
// import CoursesComponent from "./component/CoursesComponent";

// const UserHome = () => {
//   const userInfo = useSelector((state) => state.login.user);
//   const [filteredCategories, setFilteredCategories] = useState([]);
//   const [searchTerm, setSearchTerm] = useState(""); // Search input value
//   const [currentPage, setCurrentPage] = useState(1); // Current page for pagination

//   const handleFilterChange = (categories) => {
//     setFilteredCategories(categories);
//     setCurrentPage(1); // Reset to page 1 when the filter changes
//   };

//   const handleSearchChange = (term) => {
//     setSearchTerm(term);
//     setCurrentPage(1); // Reset to page 1 when the search term changes
//   };

//   const handlePageChange = (page) => {
//     setCurrentPage(page);
//   };

//   return (
//     <div className="bg-gray-100 min-h-screen mt-20">
//       {/* Header Section */}
//       <header className="bg-white shadow-md py-4">
//         <div className="container mx-auto px-4 flex justify-between items-center">
//           <h1 className="text-xl font-bold text-gray-800">
//             Welcome, {userInfo?.lastName || "Guest"}!
//           </h1>
//         </div>
//       </header>

//       {/* Search and Filter Section */}
//       <div className="container mx-auto px-4 py-4">
//         <FilterSortBar
//           onFilterChange={handleFilterChange}
//           onSearchChange={handleSearchChange}
//         />
//       </div>

//       {/* Courses Grid */}
//       <div className="container mx-auto px-4 py-8">
//         <CoursesComponent
//           filteredCategories={filteredCategories}
//           searchTerm={searchTerm}
//           currentPage={currentPage}
//           onPageChange={handlePageChange}
//         />
//       </div>
//     </div>
//   );
// };

// export default UserHome;
