package com.example.demo.repository.data;

import com.example.demo.entity.data.Lesson;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LessonRepository extends JpaRepository<Lesson, Integer> { // Thay từ Long thành Integer
}