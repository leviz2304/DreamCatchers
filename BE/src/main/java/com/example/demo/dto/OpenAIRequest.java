// src/main/java/com/example/demo/dto/OpenAIRequest.java

package com.example.demo.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class OpenAIRequest {
    private String model;
    private List<Message> messages;

    @Data
    @NoArgsConstructor
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Message {
        private String role;
        private String content;
        private String refusal; // Include this field if you're passing it
        public Message(String role, String content, String refusal) {
            this.role = role;
            this.content = content;
            this.refusal = refusal;
        }

    }
}
