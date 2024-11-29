package com.example.demo.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EssaySubmissionRequest {
    private int userId;
    private int writingTaskId;
    private String essayContent;
}
