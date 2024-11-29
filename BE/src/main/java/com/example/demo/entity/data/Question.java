package com.example.demo.entity.data;

import jakarta.persistence.*;
import lombok.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Question {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(columnDefinition = "TEXT")
    private String content; // The question text

    private String questionType; // e.g., "MULTIPLE_CHOICE", "TRUE_FALSE", "FILL_IN_THE_BLANK"

    private String correctAnswer; // For checking user responses

    private int questionNumber;

    private boolean isDeleted = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "passage_id")
    private Passage passage;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "listening_section_id")
    private ListeningSection listeningSection;

    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<QuestionOption> options = new ArrayList<>(); // For multiple-choice questions
}
