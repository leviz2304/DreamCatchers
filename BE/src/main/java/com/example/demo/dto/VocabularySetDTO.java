package com.example.demo.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class VocabularySetDTO {
    private int id;
    private String title;
    private String topic;
    private String level;
    private int quantity;
    private LocalDateTime createdAt;
    private List<VocabularyDTO> vocabularies;
}
