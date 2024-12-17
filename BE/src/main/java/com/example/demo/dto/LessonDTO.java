package com.example.demo.dto;

import lombok.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LessonDTO {
    private Integer id;

    @NotBlank(message = "Lesson name is mandatory")
    @Size(max = 255, message = "Lesson name can have at most 255 characters")
    private String name;

    private String videoUrl;
}
