package com.example.demo.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EssayFeedback {
    private CriterionFeedback taskResponse;
    private CriterionFeedback coherenceAndCohesion;
    private CriterionFeedback lexicalResource;
    private CriterionFeedback grammaticalRangeAndAccuracy;
    private double overallScore;
    private String overallFeedback;
}


