package com.example.demo.repository.data;

import com.example.demo.entity.data.SpeakingFeedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SpeakingFeedbackRepository extends JpaRepository<SpeakingFeedback, Integer> {
    List<SpeakingFeedback> findByUserId(int userId);
    List<SpeakingFeedback> findByQuestionId(int questionId);
}
