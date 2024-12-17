// src/main/java/com/example/demo/dto/OpenAIResponse.java

package com.example.demo.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

import java.util.List;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class OpenAIResponse {
    private String id;
    private String object;
    private long created;
    private String model;
    private List<Choice> choices;
    private Usage usage;

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Choice {
        private int index;
        private OpenAIRequest.Message message;
        private String finish_reason;
        // Optionally include logprobs if needed
        // private JsonNode logprobs;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Usage {
        private int prompt_tokens;
        private int completion_tokens;
        private int total_tokens;
        // Optionally include prompt_tokens_details if needed
        // private JsonNode prompt_tokens_details;
    }
}
