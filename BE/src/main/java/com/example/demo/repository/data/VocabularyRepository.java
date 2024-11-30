package com.example.demo.repository.data;

import com.example.demo.entity.data.Vocabulary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VocabularyRepository extends JpaRepository<Vocabulary, Integer> {
    Vocabulary findByWord(String word);
}