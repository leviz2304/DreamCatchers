package com.example.demo.dto;

import com.example.demo.entity.data.Progress;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CourseDTO {
    private String title;
    private int price;
    private int discount;
    private String description;
    private LocalDateTime date;
    private List<Integer> categories; // IDs of associated categories
    private List<SectionDTO> sections; // Associated sections
    private String thumbnail;
    private String video;
    private String instructor; // Instructor's email
    private boolean isEditedCategories;
    private boolean isEdited;
}
