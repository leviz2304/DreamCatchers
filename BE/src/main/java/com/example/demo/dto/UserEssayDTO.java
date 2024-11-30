package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserEssayDTO {
    private int id;
    private String content;
    private LocalDateTime submissionTime;
    private double score;
    private String email;
}