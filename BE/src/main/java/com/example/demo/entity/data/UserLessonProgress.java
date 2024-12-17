package com.example.demo.entity.data;

import com.example.demo.entity.user.User;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "user_lesson_progress")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserLessonProgress {

    @EmbeddedId
    private UserLessonProgressId id;

    private Double progress; // phần trăm tiến độ, từ 0 đến 100

    @MapsId("userId")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @MapsId("lessonId")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lesson_id")
    private Lesson lesson;
}
