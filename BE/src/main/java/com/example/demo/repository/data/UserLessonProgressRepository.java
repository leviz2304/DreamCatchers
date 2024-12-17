package com.example.demo.repository.data;
import com.example.demo.entity.data.UserLessonProgress;
import com.example.demo.entity.data.UserLessonProgressId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserLessonProgressRepository extends JpaRepository<UserLessonProgress, UserLessonProgressId> {
    UserLessonProgress findByIdUserIdAndIdLessonId(Integer userId, Integer lessonId);
}
