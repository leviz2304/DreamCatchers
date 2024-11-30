package com.example.demo.entity.data;

import com.example.demo.entity.user.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "flashcard_sets")
public class FlashcardSet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String title;
    private String description;

    private LocalDateTime createdAt;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @OneToMany(mappedBy = "set", cascade = CascadeType.ALL)
    private List<Flashcard> flashcards;

    // Getters and Setters
}