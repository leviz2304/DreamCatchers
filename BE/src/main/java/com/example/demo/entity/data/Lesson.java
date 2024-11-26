package com.example.demo.entity.data;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
//@Data
@NoArgsConstructor
@Getter
@Setter
@AllArgsConstructor
@Builder
public class Lesson {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String description;
    private String linkVideo;
    private String title;
    private String video;
    private LocalDateTime date;
    private int duration;
    private boolean isDeleted = false;
    private boolean isEdited = false;
    private String actionVideo = "NONE";
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "section_id")
    @JsonBackReference // Ngăn chặn vòng lặp khi serialize
    private Section section;
}
