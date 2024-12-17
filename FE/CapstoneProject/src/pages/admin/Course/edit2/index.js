// // src/pages/admin/Course/EditCourse.js

// import React, { useState, useEffect } from 'react';
// import UploadMedia from '../../../../component/Media/UploadMedia';
// import { getCourseById, updateCourse } from '../../../../api/apiService/dataService';
// import { toast } from 'sonner'; // Hoặc bất kỳ thư viện thông báo nào bạn đang dùng
// import { useNavigate, useParams } from 'react-router-dom';
// import {
//     Container,
//     Typography,
//     TextField,
//     Button,
//     IconButton,
//     Grid,
//     Paper,
//     Box,
// } from '@mui/material';
// import { AddCircle, RemoveCircle } from '@mui/icons-material';

// const EditCourse = () => {
//     const { id } = useParams();
//     const navigate = useNavigate();
//     const [media, setMedia] = useState({ videoUrl: '', thumbnailUrl: '' });
//     const [courseData, setCourseData] = useState({
//         title: '',
//         description: '',
//         tutorId: '',
//         categoryIds: '',
//         sections: []
//     });

//     useEffect(() => {
//         fetchCourse();
//     }, [id]);

//     const fetchCourse = async () => {
//         try {
//             const data = await getCourseById(id);
//             const { title, description, tutorId, categoryIds, thumbnailUrl, videoPreviewUrl, sections } = data.content;
//             setCourseData({
//                 title,
//                 description,
//                 tutorId: tutorId.toString(),
//                 categoryIds: [...categoryIds].join(', '),
//                 sections: sections.map(section => ({
//                     name: section.name,
//                     lessons: section.lessons.map(lesson => ({
//                         name: lesson.name,
//                         videoUrl: lesson.videoUrl
//                     }))
//                 }))
//             });
//             setMedia({ videoUrl: videoPreviewUrl, thumbnailUrl: thumbnailUrl });
//         } catch (error) {
//             console.error("Failed to fetch course:", error);
//             toast.error("Failed to fetch course.");
//         }
//     };

//     const handleMediaUpload = (uploadedMedia) => {
//         setMedia(uploadedMedia);
//     };

//     const addSection = () => {
//         setCourseData({
//             ...courseData,
//             sections: [...courseData.sections, { name: '', lessons: [{ name: '', videoUrl: '' }] }]
//         });
//     };

//     const removeSection = (index) => {
//         const newSections = courseData.sections.filter((_, i) => i !== index);
//         setCourseData({ ...courseData, sections: newSections });
//     };

//     const addLesson = (sectionIndex) => {
//         const newSections = [...courseData.sections];
//         newSections[sectionIndex].lessons.push({ name: '', videoUrl: '' });
//         setCourseData({ ...courseData, sections: newSections });
//     };

//     const removeLesson = (sectionIndex, lessonIndex) => {
//         const newSections = [...courseData.sections];
//         newSections[sectionIndex].lessons = newSections[sectionIndex].lessons.filter((_, i) => i !== lessonIndex);
//         setCourseData({ ...courseData, sections: newSections });
//     };

//     const handleCourseChange = (e) => {
//         const { name, value } = e.target;
//         setCourseData({ ...courseData, [name]: value });
//     };

//     const handleSectionChange = (sectionIndex, e) => {
//         const { name, value } = e.target;
//         const newSections = [...courseData.sections];
//         newSections[sectionIndex][name] = value;
//         setCourseData({ ...courseData, sections: newSections });
//     };

//     const handleLessonChange = (sectionIndex, lessonIndex, e) => {
//         const { name, value } = e.target;
//         const newSections = [...courseData.sections];
//         newSections[sectionIndex].lessons[lessonIndex][name] = value;
//         setCourseData({ ...courseData, sections: newSections });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         // Validate media upload
//         if (!media.videoUrl || !media.thumbnailUrl) {
//             toast.error("Vui lòng upload video và thumbnail trước khi cập nhật khóa học.");
//             return;
//         }

//         // Validate course data
//         if (!courseData.title || !courseData.description || !courseData.tutorId || !courseData.categoryIds) {
//             toast.error("Vui lòng điền đầy đủ thông tin khóa học.");
//             return;
//         }

//         // Convert categoryIds từ chuỗi sang mảng số
//         const categoryIdsArray = courseData.categoryIds.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));

//         // Prepare CourseDTO
//         const courseDTO = {
//             title: courseData.title,
//             description: courseData.description,
//             thumbnailUrl: media.thumbnailUrl,
//             videoPreviewUrl: media.videoUrl,
//             tutorId: parseInt(courseData.tutorId),
//             categoryIds: new Set(categoryIdsArray),
//             sections: courseData.sections.map(section => ({
//                 name: section.name,
//                 lessons: section.lessons.map(lesson => ({
//                     name: lesson.name,
//                     videoUrl: lesson.videoUrl
//                 }))
//             }))
//         };

//         try {
//             const response = await updateCourse(id, courseDTO);
//             toast.success("Cập nhật khóa học thành công!");
//             // Chuyển hướng đến danh sách khóa học
//             navigate('/admin/courses');
//         } catch (error) {
//             console.error("Error updating course:", error);
//             toast.error("Cập nhật khóa học thất bại!");
//         }
//     };

//     return (
//         <Container maxWidth="lg">
//             <Typography variant="h4" gutterBottom>
//                 Edit Course
//             </Typography>
//             <Paper sx={{ p: 3 }}>
//                 <form onSubmit={handleSubmit}>
//                     <UploadMedia onUploadComplete={handleMediaUpload} existingMedia={media} />
//                     <Grid container spacing={2} sx={{ mt: 2 }}>
//                         <Grid item xs={12}>
//                             <TextField
//                                 label="Title"
//                                 name="title"
//                                 value={courseData.title}
//                                 onChange={handleCourseChange}
//                                 fullWidth
//                                 required
//                             />
//                         </Grid>
//                         <Grid item xs={12}>
//                             <TextField
//                                 label="Description"
//                                 name="description"
//                                 value={courseData.description}
//                                 onChange={handleCourseChange}
//                                 fullWidth
//                                 multiline
//                                 rows={4}
//                                 required
//                             />
//                         </Grid>
//                         <Grid item xs={12} sm={6}>
//                             <TextField
//                                 label="Tutor ID"
//                                 name="tutorId"
//                                 type="number"
//                                 value={courseData.tutorId}
//                                 onChange={handleCourseChange}
//                                 fullWidth
//                                 required
//                             />
//                         </Grid>
//                         <Grid item xs={12} sm={6}>
//                             <TextField
//                                 label="Category IDs (comma separated)"
//                                 name="categoryIds"
//                                 value={courseData.categoryIds}
//                                 onChange={handleCourseChange}
//                                 fullWidth
//                                 required
//                                 helperText="Ví dụ: 1,2,3"
//                             />
//                         </Grid>
//                     </Grid>
//                     <Box sx={{ mt: 4 }}>
//                         <Typography variant="h5">Sections</Typography>
//                         {courseData.sections.map((section, sectionIndex) => (
//                             <Paper key={sectionIndex} sx={{ p: 2, mt: 2, position: 'relative' }}>
//                                 <IconButton
//                                     color="error"
//                                     onClick={() => removeSection(sectionIndex)}
//                                     sx={{ position: 'absolute', top: 10, right: 10 }}
//                                 >
//                                     <RemoveCircle />
//                                 </IconButton>
//                                 <Grid container spacing={2}>
//                                     <Grid item xs={12}>
//                                         <TextField
//                                             label={`Section ${sectionIndex + 1} Name`}
//                                             name="name"
//                                             value={section.name}
//                                             onChange={e => handleSectionChange(sectionIndex, e)}
//                                             fullWidth
//                                             required
//                                         />
//                                     </Grid>
//                                     <Grid item xs={12}>
//                                         <Typography variant="subtitle1">Lessons</Typography>
//                                         {section.lessons.map((lesson, lessonIndex) => (
//                                             <Paper key={lessonIndex} sx={{ p: 2, mt: 1, position: 'relative' }}>
//                                                 <IconButton
//                                                     color="error"
//                                                     onClick={() => removeLesson(sectionIndex, lessonIndex)}
//                                                     sx={{ position: 'absolute', top: 10, right: 10 }}
//                                                 >
//                                                     <RemoveCircle />
//                                                 </IconButton>
//                                                 <Grid container spacing={2}>
//                                                     <Grid item xs={12} sm={6}>
//                                                         <TextField
//                                                             label={`Lesson ${lessonIndex + 1} Name`}
//                                                             name="name"
//                                                             value={lesson.name}
//                                                             onChange={e => handleLessonChange(sectionIndex, lessonIndex, e)}
//                                                             fullWidth
//                                                             required
//                                                         />
//                                                     </Grid>
//                                                     <Grid item xs={12} sm={6}>
//                                                         <TextField
//                                                             label={`Lesson ${lessonIndex + 1} Video URL`}
//                                                             name="videoUrl"
//                                                             value={lesson.videoUrl}
//                                                             onChange={e => handleLessonChange(sectionIndex, lessonIndex, e)}
//                                                             fullWidth
//                                                         />
//                                                         {lesson.videoUrl && (
//                                                             <Box sx={{ mt: 1 }}>
//                                                                 <video width="240" height="180" controls>
//                                                                     <source src={lesson.videoUrl} type="video/mp4" />
//                                                                     Your browser does not support the video tag.
//                                                                 </video>
//                                                             </Box>
//                                                         )}
//                                                     </Grid>
//                                                 </Grid>
//                                             </Paper>
//                                         ))}
//                                         <Button
//                                             variant="outlined"
//                                             startIcon={<AddCircle />}
//                                             onClick={() => addLesson(sectionIndex)}
//                                             sx={{ mt: 1 }}
//                                         >
//                                             Add Lesson
//                                         </Button>
//                                     </Grid>
//                                 </Grid>
//                             </Paper>
//                         ))}
//                         <Button
//                             variant="outlined"
//                             startIcon={<AddCircle />}
//                             onClick={addSection}
//                             sx={{ mt: 2 }}
//                         >
//                             Add Section
//                         </Button>
//                     </Box>
//                     <Button
//                         type="submit"
//                         variant="contained"
//                         color="primary"
//                         sx={{ mt: 4 }}
//                     >
//                         Update Course
//                     </Button>
//                 </form>
//             </Paper>
//         </Container>
//     );
// };

// export default EditCourse;
