package com.example.demo.dto;

import lombok.*;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QuestionDTO {

    private int id;
    private String content;
    private String questionType;
    private int questionNumber;
    private List<QuestionOptionDTO> options;
}
