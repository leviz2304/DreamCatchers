package com.example.demo.service;

import com.example.demo.entity.data.Course;
import com.example.demo.entity.data.Enrollment;
import com.example.demo.entity.data.EnrollmentId;
import com.example.demo.entity.user.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.repository.data.CourseRepository;
import com.example.demo.repository.data.EnrollmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class EnrollmentService {
    @Autowired
    private EnrollmentRepository enrollmentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CourseRepository courseRepository;

    public boolean isUserEnrolledInCourse(Integer userId, Integer courseId) {
        return enrollmentRepository.existsByIdUserIdAndIdCourseId(userId, courseId);
    }
    public Enrollment enrollUserToCourse(Integer userId, Integer courseId) {
        // Check user
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check course
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        // Check nếu đã enroll chưa
        EnrollmentId enrollmentId = new EnrollmentId(userId, courseId);
        if (enrollmentRepository.existsById(enrollmentId)) {
            throw new RuntimeException("User already enrolled in this course");
        }

        Enrollment enrollment = new Enrollment();
        enrollment.setId(enrollmentId);
        enrollment.setUser(user);
        enrollment.setCourse(course);
        enrollment.setEnrolledAt(LocalDateTime.now());

        return enrollmentRepository.save(enrollment);
    }
}