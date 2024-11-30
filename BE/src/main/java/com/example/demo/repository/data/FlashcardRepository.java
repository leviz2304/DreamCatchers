package com.example.demo.repository.data;

import com.example.demo.entity.data.Flashcard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FlashcardRepository extends JpaRepository<Flashcard, Integer> {
}