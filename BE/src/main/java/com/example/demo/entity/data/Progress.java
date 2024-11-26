package com.example.demo.entity.data;

import com.example.demo.entity.user.User;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jdk.jshell.spi.ExecutionControl;
import lombok.*;
import org.antlr.v4.runtime.misc.IntegerList;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Progress {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private  int id;

    @ElementCollection // 1
    @CollectionTable(name = "lesson_ids", joinColumns = @JoinColumn(name = "id")) // 2
    @Column(name = "list_lessonid") // 3
    private List<Integer> lessonIds;

    @ManyToOne(cascade = CascadeType.PERSIST)
    @JoinColumn(name = "course_id")

    private Course course;

    @ManyToOne(cascade = CascadeType.PERSIST)
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private User user;
}
