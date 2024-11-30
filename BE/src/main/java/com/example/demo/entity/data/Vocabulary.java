package com.example.demo.entity.data;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
@Getter
@Setter
@Entity
@Table(name = "vocabulary")
public class Vocabulary {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String word;
    private String definition;
    private String example;

    private LocalDateTime createdAt;

    // Getters and Setters
}