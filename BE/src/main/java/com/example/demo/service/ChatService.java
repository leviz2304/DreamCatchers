package com.example.demo.service;

import com.example.demo.dto.UserDTO;
import com.example.demo.entity.data.Course;
import com.example.demo.entity.user.Role;
import com.example.demo.entity.user.User;
import com.example.demo.repository.data.CourseRepository;
import com.example.demo.repository.data.EnrollmentRepository;
import com.example.demo.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final UserService userService;
    private final CourseRepository courseRepository;
    private final EnrollmentRepository enrollmentRepository;

    /**
     * Lấy danh sách Instructor (giảng viên) mà user này có thể nhắn tin (từ các khóa học đã đăng ký).
     */
    public List<UserDTO> getInstructorsForUser(Integer userId) {
        User user = userService.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getRole() != Role.USER) {
            throw new RuntimeException("Chỉ USER mới có thể gọi endpoint này.");
        }

        // Lấy tất cả các khóa học mà user đã enroll
        List<Course> courses = courseRepository.findCoursesByUserId(userId);

        // Lấy danh sách các giảng viên của các khóa học
        Set<User> instructors = new HashSet<>();
        for (Course course : courses) {
            User tutor = course.getTutor();
            instructors.add(tutor);
        }

        return instructors.stream().map(UserDTO::new).collect(Collectors.toList());
    }

    /**
     * Lấy danh sách học viên (students) của các khóa học mà tutor này dạy.
     */
    public List<UserDTO> getStudentsForTutor(Integer tutorId) {
        User tutor = userService.findById(tutorId).orElseThrow(() -> new RuntimeException("Tutor not found"));

        if (tutor.getRole() != Role.INSTRUCTOR && tutor.getRole() != Role.ADMIN) {
            throw new RuntimeException("Chỉ INSTRUCTOR hoặc ADMIN mới có thể gọi endpoint này.");
        }

        // Lấy tất cả các khóa học mà tutor này dạy
        List<Course> courses = courseRepository.findByTutor(tutor);

        // Lấy danh sách tất cả các học viên của các khóa học này
        Set<User> students = new HashSet<>();
        for (Course course : courses) {
            // Tất cả các học viên đã đăng ký vào khóa học này
            List<User> enrolledStudents = enrollmentRepository.findByCourseId(course.getId())
                    .stream()
                    .map(enrollment -> enrollment.getUser())
                    .collect(Collectors.toList());
            students.addAll(enrolledStudents);
        }

        return students.stream().map(UserDTO::new).collect(Collectors.toList());
    }
}
