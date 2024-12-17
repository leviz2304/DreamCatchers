// // src/pages/admin/Course/ListCourse.js

// import React, { useEffect, useState } from 'react';
// import { getCourses, deleteCourse } from '../../../../api/apiService/dataService';
// import { useNavigate } from 'react-router-dom';
// import {
//     Table,
//     TableBody,
//     TableCell,
//     TableContainer,
//     TableHead,
//     TableRow,
//     Paper,
//     IconButton,
//     Typography,
//     Button,
//     TablePagination,
// } from '@mui/material';
// import { Edit, Delete, Info } from '@mui/icons-material';
// import { toast } from 'sonner';

// const ListCourse = () => {
//     const [courses, setCourses] = useState([]);
//     const [page, setPage] = useState(0);
//     const [rowsPerPage, setRowsPerPage] = useState(10);
//     const [totalCourses, setTotalCourses] = useState(0);
//     const navigate = useNavigate();

//     useEffect(() => {
//         fetchCourses();
//     }, [page, rowsPerPage]);

//     const fetchCourses = async () => {
//         try {
//             const data = await getCourses(page + 1, rowsPerPage); // API sử dụng 1-based indexing
//             setCourses(data.content);
//             setTotalCourses(data.totalElements);
//         } catch (error) {
//             console.error("Failed to fetch courses:", error);
//             toast.error("Failed to fetch courses.");
//         }
//     };

//     const handleDelete = async (id) => {
//         if (window.confirm("Are you sure you want to delete this course?")) {
//             try {
//                 await deleteCourse(id);
//                 toast.success("Course deleted successfully.");
//                 fetchCourses();
//             } catch (error) {
//                 console.error("Failed to delete course:", error);
//                 toast.error("Failed to delete course.");
//             }
//         }
//     };

//     const handleEdit = (id) => {
//         navigate(`/admin/courses/edit/${id}`);
//     };

//     const handleDetail = (id) => {
//         navigate(`/admin/courses/detail/${id}`);
//     };

//     const handleChangePage = (event, newPage) => {
//         setPage(newPage);
//     };

//     const handleChangeRowsPerPage = (event) => {
//         setRowsPerPage(parseInt(event.target.value, 10));
//         setPage(0);
//     };

//     return (
//         <Paper sx={{ p: 3 }}>
//             <Typography variant="h4" gutterBottom>
//                 List of Courses
//             </Typography>
//             <Button variant="contained" color="primary" onClick={() => navigate('/admin/courses/create')}>
//                 Create New Course
//             </Button>
//             <TableContainer component={Paper} sx={{ mt: 3 }}>
//                 <Table>
//                     <TableHead>
//                         <TableRow>
//                             <TableCell>ID</TableCell>
//                             <TableCell>Title</TableCell>
//                             <TableCell>Description</TableCell>
//                             <TableCell>Tutor ID</TableCell>
//                             <TableCell>Categories</TableCell>
//                             <TableCell>Actions</TableCell>
//                         </TableRow>
//                     </TableHead>
//                     <TableBody>
//                         {courses.map((course) => (
//                             <TableRow key={course.id}>
//                                 <TableCell>{course.id}</TableCell>
//                                 <TableCell>{course.title}</TableCell>
//                                 <TableCell>{course.description}</TableCell>
//                                 <TableCell>{course.tutorId}</TableCell>
//                                 <TableCell>{[...course.categoryIds].join(', ')}</TableCell>
//                                 <TableCell>
//                                     <IconButton color="primary" onClick={() => handleEdit(course.id)}>
//                                         <Edit />
//                                     </IconButton>
//                                     <IconButton color="secondary" onClick={() => handleDelete(course.id)}>
//                                         <Delete />
//                                     </IconButton>
//                                     <IconButton color="info" onClick={() => handleDetail(course.id)}>
//                                         <Info />
//                                     </IconButton>
//                                 </TableCell>
//                             </TableRow>
//                         ))}
//                         {courses.length === 0 && (
//                             <TableRow>
//                                 <TableCell colSpan={6} align="center">
//                                     No courses found.
//                                 </TableCell>
//                             </TableRow>
//                         )}
//                     </TableBody>
//                 </Table>
//                 <TablePagination
//                     component="div"
//                     count={totalCourses}
//                     page={page}
//                     onPageChange={handleChangePage}
//                     rowsPerPage={rowsPerPage}
//                     onRowsPerPageChange={handleChangeRowsPerPage}
//                     rowsPerPageOptions={[5, 10, 25]}
//                 />
//             </TableContainer>
//         </Paper>
//     );
// };

// export default ListCourse;
