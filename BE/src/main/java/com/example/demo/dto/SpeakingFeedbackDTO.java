// src/main/java/com/example/demo/dto/SpeakingFeedbackDTO.java

package com.example.demo.dto;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.Data;

import java.io.IOException;
import java.util.List;

@Data
public class SpeakingFeedbackDTO {
    private List<PronunciationError> pronunciationErrors;
    private List<GrammarError> grammarErrors;
    private List<VocabularyError> vocabularyErrors;
    private String overallFeedback;

    // Method to convert JSON string to DTO
    public static SpeakingFeedbackDTO fromJson(String json) {
        ObjectMapper mapper = new ObjectMapper();
        try {
            return mapper.readValue(json, SpeakingFeedbackDTO.class);
        } catch (IOException e) {
            throw new RuntimeException("Failed to parse SpeakingFeedbackDTO from JSON.", e);
        }
    }

    // Method to convert DTO to JSON string
    public String toJson() {
        ObjectMapper mapper = new ObjectMapper();
        try {
            return mapper.writeValueAsString(this);
        } catch (IOException e) {
            throw new RuntimeException("Failed to convert SpeakingFeedbackDTO to JSON.", e);
        }
    }

    @Data
    public static class PronunciationError {
        private String word;
        private String error;
        private String recommendation;
    }

    @Data
    public static class GrammarError {
        private String sentence;
        private String error;
        private String recommendation;
    }

    @Data
    public static class VocabularyError {
        private String word;
        private String error;
        private String recommendation;
    }
}
