package com.example.demo.entity.data;

import com.example.demo.entity.user.User;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserEssay {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(columnDefinition = "TEXT")
    private String content; // User's essay content

    private LocalDateTime submissionTime;

    @Column(columnDefinition = "TEXT")
    private String feedback; // Feedback from the ML model/API

    private double score; // Optional score assigned

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "writing_task_id")
    private WritingTask writingTask;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private User user;
}
