package com.example.demo.dto;

import lombok.*;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class PronunciationAssessmentDTO {
    private Integer sentenceId;
    private MultipartFile audioFile; // Sử dụng MultipartFile để nhận file
    // Getters and Setters
}