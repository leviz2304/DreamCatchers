package com.example.demo.repository.data;

import com.example.demo.entity.data.Sentence;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SentenceRepository extends JpaRepository<Sentence, Integer> {
    List<Sentence> findByTopicId(Integer topicId);
}
