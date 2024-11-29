package com.example.demo.dto;

import lombok.*;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ListeningSectionDTO {

    private int id;
    private int sectionNumber;
    private String audioUrl;
    private String transcript;
    private List<QuestionDTO> questions;
}
