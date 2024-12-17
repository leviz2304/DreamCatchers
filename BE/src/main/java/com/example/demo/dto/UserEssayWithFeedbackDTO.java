package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserEssayWithFeedbackDTO {
    private Integer id;
    private String content;
    private LocalDateTime submissionTime;
    private double score;
    private EssayFeedback feedback;
}
