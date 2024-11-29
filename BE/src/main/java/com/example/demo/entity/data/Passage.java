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
public class Passage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private int passageNumber; // 1, 2, or 3

    @Column(columnDefinition = "TEXT")
    private String content; // The text content of the passage

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "test_id")
    private Test test;

    @OneToMany(mappedBy = "passage", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Question> questions = new ArrayList<>();
}
