package com.example.demo.entity.data;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Test {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String title; // e.g., "IELTS Cambridge Reading Test 1"

    private String type; // "READING" or "LISTENING"

    private LocalDateTime date;

    private boolean isDeleted = false;

    // For Reading Test
    @OneToMany(mappedBy = "test", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Passage> passages = new ArrayList<>();

    // For Listening Test
    @OneToMany(mappedBy = "test", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ListeningSection> listeningSections = new ArrayList<>();

}
