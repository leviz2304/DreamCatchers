// src/main/java/com/example/demo/dto/EssayFeedback.java

package com.example.demo.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true) // Add this annotation
public class EssayFeedback {
    private List<GrammarError> grammarErrors;
    private List<VocabularyError> vocabularyErrors;
    private String overallFeedback;
    private int overallScore;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class GrammarError {
        private String sentence;
        private String error;
        private String recommendation;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class VocabularyError {
        private String word;
        private String error;
        private String recommendation;
    }
}
