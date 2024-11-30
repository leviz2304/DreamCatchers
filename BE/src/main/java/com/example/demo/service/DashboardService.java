package com.example.demo.service;

import com.example.demo.entity.user.Role;
import com.example.demo.repository.UserRepository;
import com.example.demo.repository.data.CourseRepository;
import com.example.demo.repository.data.PostRepository;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class DashboardService {

    private final CourseRepository courseRepository;
    private final UserRepository userRepository;
    private final PostRepository postRepository;

    public DashboardService(CourseRepository courseRepository, UserRepository userRepository, PostRepository postRepository) {
        this.courseRepository = courseRepository;
        this.userRepository = userRepository;
        this.postRepository = postRepository;
    }

    public Map<String, Integer> getDashboardStats() {
        int totalCourses = courseRepository.countActiveCourses(); // Trả về int
        int totalStudents = userRepository.countByRole(Role.USER);
        int totalInstructors = userRepository.countByRole(Role.INSTRUCTOR);
        int totalPosts = postRepository.countActivePosts(); // Trả về int

        return Map.of(
                "totalCourses", totalCourses,
                "totalStudents", totalStudents,
                "totalInstructors", totalInstructors,
                "totalPosts", totalPosts
        );
    }
}
