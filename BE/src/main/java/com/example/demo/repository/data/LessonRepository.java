package com.example.demo.repository.data;

import com.example.demo.entity.data.Course;
import com.example.demo.entity.data.Lesson;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Repository
public interface LessonRepository extends JpaRepository<Lesson, Integer> {
//    @Query(value = "select l.* from lesson l where l.is_deleted = :isDeleted and l.section_id = :sectionId", nativeQuery = true)
//    Optional<List<Lesson>> findLessonsBySection(int sectionId, boolean isDeleted);
    @Query(value = "select * from lesson l where l.section_id in :list ", nativeQuery = true)
    List<Lesson> findLessonsBySections(List<Integer> list);
}
