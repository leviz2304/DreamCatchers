package com.example.demo.repository.data;

import com.example.demo.entity.data.PronunciationAssessment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PronunciationAssessmentRepository extends JpaRepository<PronunciationAssessment, Integer> {
    List<PronunciationAssessment> findByUserId(Integer userId);
}
