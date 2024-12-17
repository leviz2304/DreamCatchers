package com.example.demo.entity.data;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Table(name = "sections")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Section {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String name;

    // Liên kết nhiều - một với Course
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id")
    private Course course;

    // Liên kết một-nhiều với Lesson
    @OneToMany(mappedBy = "section", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Lesson> lessons;
}
