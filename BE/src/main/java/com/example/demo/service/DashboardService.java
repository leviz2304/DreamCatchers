package com.example.demo.service;

import com.example.demo.entity.user.Role;
import com.example.demo.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class DashboardService {

//    private final CourseRepository courseRepository;
    private final UserRepository userRepository;

    public DashboardService( UserRepository userRepository) {
//        this.courseRepository = courseRepository;
        this.userRepository = userRepository;
    }

    public Map<String, Integer> getDashboardStats() {
//        int totalCourses = courseRepository.countActiveCourses(); // Trả về int
        int totalStudents = userRepository.countByRole(Role.USER);
        int totalInstructors = userRepository.countByRole(Role.INSTRUCTOR);

        return Map.of(
//                "totalCourses", totalCourses,
                "totalStudents", totalStudents,
                "totalInstructors", totalInstructors
        );
    }
}
