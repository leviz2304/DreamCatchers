package com.example.demo.repository.data;


import com.example.demo.entity.data.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CourseRepository extends JpaRepository<Course, Integer> { // Thay từ Long thành Integer
}
