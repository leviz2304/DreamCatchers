package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LessonStatusDTO {
    private Integer lessonId;
    private String lessonName;
    private boolean unlocked;


    // getters/setters
}