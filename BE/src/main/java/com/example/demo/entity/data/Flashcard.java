package com.example.demo.entity.data;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "flashcards")
public class Flashcard {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(name = "set_id")
    private FlashcardSet set;

    @ManyToOne
    @JoinColumn(name = "vocabulary_id")
    private Vocabulary vocabulary;

    // Getters and Setters
}