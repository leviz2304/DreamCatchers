package com.example.demo.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)

public class EssayFeedback {
    private List<GrammarError> grammarErrors;
    private List<VocabularyError> vocabularyErrors;
    private String overallFeedback;
    private double overallScore;

}


