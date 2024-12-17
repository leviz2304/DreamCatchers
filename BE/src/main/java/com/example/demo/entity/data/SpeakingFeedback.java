// src/main/java/com/example/demo/entity/data/SpeakingFeedback.java

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
public class SpeakingFeedback {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Lob
    @Column(nullable = false, columnDefinition = "LONGTEXT")
    private String transcript;

    @Lob
    @Column(nullable = false, columnDefinition = "LONGTEXT")
    private String feedbackJson; // JSON containing pronunciation, grammar, vocab feedback

    private LocalDateTime submissionTime;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnore
    @JoinColumn(name = "question_id", nullable = false)
    private SpeakingQuestion question;

    @Column(nullable = true)
    private String audioUrl;
}
