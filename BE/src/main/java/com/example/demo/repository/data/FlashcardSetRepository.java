package com.example.demo.repository.data;

import com.example.demo.entity.data.FlashcardSet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FlashcardSetRepository extends JpaRepository<FlashcardSet, Integer> {
    List<FlashcardSet> findByUserId(Integer userId);
}