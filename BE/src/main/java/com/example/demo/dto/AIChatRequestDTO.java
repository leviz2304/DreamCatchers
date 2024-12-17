// src/main/java/com/example/demo/dto/AIChatRequestDTO.java

package com.example.demo.dto;

import lombok.Data;

@Data
public class AIChatRequestDTO {
    private int userId;
    private int questionId;
    private String userInput;
}
