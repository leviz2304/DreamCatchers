package com.example.demo.entity.data;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WritingTask {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String taskType; // "TASK1" or "TASK2"

    private String title;

    @Column(columnDefinition = "TEXT")
    private String prompt; // The essay prompt

    private LocalDateTime dateCreated;

    private boolean isDeleted = false;
}
