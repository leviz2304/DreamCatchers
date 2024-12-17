package com.example.demo.repository.data;

import com.example.demo.entity.data.PronunciationProgress;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PronunciationProgressRepository extends JpaRepository<PronunciationProgress, Integer> {
    List<PronunciationProgress> findByUserIdAndTopicId(Integer userId, Integer topicId);
}