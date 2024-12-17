// src/pages/admin/Course/CourseDetail.js

import React, { useEffect, useState } from 'react';
import { getCourseById } from'../../../../api/apiService/dataService';
import { useParams } from 'react-router-dom';
import {
    Container,
    Typography,
    Paper,
    Grid,
    Box,
} from '@mui/material';
import { toast } from 'sonner';

const CourseDetail = () => {
    const { id } = useParams();
    const [course, setCourse] = useState(null);

    useEffect(() => {
        fetchCourse();
    }, [id]);

    const fetchCourse = async () => {
        try {
            const data = await getCourseById(id);
            setCourse(data.content); // Assuming API trả về { status, mess, content }
        } catch (error) {
            console.error("Failed to fetch course:", error);
            toast.error("Failed to fetch course.");
        }
    };

    if (!course) {
        return (
            <Container>
                <Typography variant="h5">Loading...</Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg">
            <Typography variant="h4" gutterBottom>
                Course Detail
            </Typography>
            <Paper sx={{ p: 3 }}>
                <Typography variant="h5">Title: {course.title}</Typography>
                <Typography variant="subtitle1">Description: {course.description}</Typography>
                <Typography variant="subtitle1">Tutor ID: {course.tutorId}</Typography>
                <Typography variant="subtitle1">Categories: {[...course.categoryIds].join(', ')}</Typography>
                <Box sx={{ mt: 4 }}>
                    <Typography variant="h6">Sections:</Typography>
                    {course.sections.map((section, index) => (
                        <Paper key={index} sx={{ p: 2, mt: 2 }}>
                            <Typography variant="subtitle1">Section {index + 1}: {section.name}</Typography>
                            <Box sx={{ ml: 4 }}>
                                <Typography variant="subtitle2">Lessons:</Typography>
                                {section.lessons.map((lesson, lessonIndex) => (
                                    <Box key={lessonIndex} sx={{ ml: 2 }}>
                                        <Typography>Lesson {lessonIndex + 1}: {lesson.name}</Typography>
                                        {lesson.videoUrl && (
                                            <video width="240" height="180" controls>
                                                <source src={lesson.videoUrl} type="video/mp4" />
                                                Your browser does not support the video tag.
                                            </video>
                                        )}
                                    </Box>
                                ))}
                            </Box>
                        </Paper>
                    ))}
                </Box>
            </Paper>
        </Container>
    );
};

export default CourseDetail;
