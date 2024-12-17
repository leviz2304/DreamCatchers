package com.example.demo.dto;

import lombok.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SectionDTO {
    private Integer id;

    @NotBlank(message = "Section name is mandatory")
    @Size(max = 255, message = "Section name can have at most 255 characters")
    private String name;

    private Integer courseId; // Sử dụng Integer để khớp với Course.id

    private List<LessonDTO> lessons;
}
