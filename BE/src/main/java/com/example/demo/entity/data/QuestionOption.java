package com.example.demo.entity.data;


import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "question_option") // Specify a non-reserved table name

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuestionOption {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String content; // Option text

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id")
    private Question question;
}
