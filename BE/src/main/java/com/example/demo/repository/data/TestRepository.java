package com.example.demo.repository.data;

import com.example.demo.entity.data.Test;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TestRepository extends JpaRepository<Test, Integer> {
    // Additional query methods if needed
    @EntityGraph(attributePaths = {"passages.questions"})
    Optional<Test> findById(int id);
    @EntityGraph(attributePaths = {"passages.questions"})
    @Query("SELECT t FROM Test t WHERE t.id = :id")
    Optional<Test> findByIdWithPassagesAndQuestions(@Param("id") int id);

    @EntityGraph(attributePaths = {"listeningSections.questions"})
    @Query("SELECT t FROM Test t WHERE t.id = :id")
    Optional<Test> findByIdWithSectionsAndQuestions(@Param("id") int id);


}
