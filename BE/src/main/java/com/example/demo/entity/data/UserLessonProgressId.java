package com.example.demo.entity.data;

import jakarta.persistence.Embeddable;
import lombok.*;

import java.io.Serializable;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserLessonProgressId implements Serializable {
    private Integer userId;
    private Integer lessonId;
}
