package com.example.demo.repository.data;

import com.example.demo.entity.data.SpeakingQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SpeakingQuestionRepository extends JpaRepository<SpeakingQuestion, Integer> {
    List<SpeakingQuestion> findByTopicId(int topicId);
}
