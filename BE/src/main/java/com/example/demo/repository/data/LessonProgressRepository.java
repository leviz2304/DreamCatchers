package com.example.demo.repository.data;

import com.example.demo.entity.data.LessonProgress;
import com.example.demo.entity.data.LessonProgressKey;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface LessonProgressRepository extends JpaRepository<LessonProgress, LessonProgressKey> {
    List<LessonProgress> findByUserId(int userId);
    @Query("SELECT lp FROM LessonProgress lp JOIN FETCH lp.lesson l JOIN FETCH l.section s JOIN FETCH s.course c WHERE lp.user.id = :userId")
    List<LessonProgress> findByUserIdWithCourse(@Param("userId") int userId);
}
