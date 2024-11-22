package com.example.demo.entity.data;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
@Getter
@Setter
@Embeddable
@NoArgsConstructor
@AllArgsConstructor
public class LessonProgressKey implements Serializable {
    @Column(name = "user_id")
    private int userId;

    @Column(name = "lesson_id")
    private int lessonId;
}
