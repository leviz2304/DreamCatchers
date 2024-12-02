package com.example.demo.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class VocabularyDTO {
    private int id;
    private String word;
    private String definition;
    private String example;
    private String topic;
    private String level;
    private LocalDateTime createdAt;
}
