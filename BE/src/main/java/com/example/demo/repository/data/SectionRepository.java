package com.example.demo.repository.data;

import com.example.demo.entity.data.Section;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SectionRepository extends JpaRepository<Section, Integer> {
    @Query(value = "select s.* from section s where s.course_id = :courseId and s.is_deleted = :isDeleted", nativeQuery = true)
    Optional<List<Section>> findSectionsByCourse(int courseId, boolean isDeleted);
}