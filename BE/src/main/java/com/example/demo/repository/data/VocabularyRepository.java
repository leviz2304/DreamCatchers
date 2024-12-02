package com.example.demo.repository.data;

import com.example.demo.entity.data.Vocabulary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VocabularyRepository extends JpaRepository<Vocabulary, Integer> {
    Vocabulary findByWord(String word);
    List<Vocabulary> findByVocabularySetId(Integer setId);}