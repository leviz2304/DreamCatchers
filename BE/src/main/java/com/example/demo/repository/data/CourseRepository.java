package com.example.demo.repository.data;


import com.example.demo.entity.data.Course;
import com.example.demo.entity.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourseRepository extends JpaRepository<Course, Integer> { // Thay từ Long thành Integer
    List<Course> findByTutor(User tutor);

    // Lấy tất cả các khóa học mà user đã enroll
    @Query("SELECT e.course FROM Enrollment e WHERE e.user.id = ?1")
    List<Course> findCoursesByUserId(Integer userId);
}
