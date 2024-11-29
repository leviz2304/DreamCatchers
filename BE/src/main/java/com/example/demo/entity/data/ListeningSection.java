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
public class ListeningSection {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private int sectionNumber; // 1, 2, 3, or 4

    private String audioUrl; // URL to the audio file

    @Column(columnDefinition = "TEXT")
    private String transcript; // Optional: transcript of the audio

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "test_id")
    private Test test;

    @OneToMany(mappedBy = "listeningSection", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Question> questions = new ArrayList<>();
}
