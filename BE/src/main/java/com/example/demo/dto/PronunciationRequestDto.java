package com.example.demo.dto;

import lombok.*;
import org.springframework.web.multipart.MultipartFile;
@Getter
@Setter
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PronunciationRequestDto {
    private Integer userId;
    private Integer topicId;
    private Integer sentenceId;
    private MultipartFile file;

    // Getters, Setters, Constructors
}
