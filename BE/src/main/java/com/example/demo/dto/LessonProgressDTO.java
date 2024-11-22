package com.example.demo.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LessonProgressDTO {
    private int userId;
    private int lessonId;
    private double progressPercentage;
    private boolean completed;
    private boolean unlocked;

    // Getters and setters
}
