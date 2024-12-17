package com.example.demo.entity.data;

import com.example.demo.entity.user.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "enrollments")
public class Enrollment {

    @EmbeddedId
    private EnrollmentId id; // Khóa chính là cặp (userId, courseId)

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("userId") // Tham chiếu tới trường userId trong khóa chính
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("courseId") // Tham chiếu tới trường courseId trong khóa chính
    @JoinColumn(name = "course_id")
    private Course course;

    // Các trường bổ sung: ngày enroll, trạng thái, tiến độ...
    private LocalDateTime enrolledAt;
    private Double progress; // phần trăm hoặc điểm
    // ...
}
