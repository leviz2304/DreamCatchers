package com.example.demo.dto;

import lombok.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.List;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CourseDTO {
    private Integer id; // Sử dụng Integer thay vì Long

    @NotBlank(message = "Title is mandatory")
    @Size(max = 255, message = "Title can have at most 255 characters")
    private String title;

    @Size(max = 1000, message = "Description can have at most 1000 characters")
    private String description;

    private String thumbnailUrl;
    private String videoPreviewUrl;

    private Integer tutorId;
    private Set<Integer> categoryIds;

    private List<SectionDTO> sections;
}
