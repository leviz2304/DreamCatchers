// src/main/java/com/example/demo/service/CommentService.java
package com.example.demo.service;

import com.example.demo.entity.data.Comment;
import com.example.demo.entity.data.Course;
import com.example.demo.entity.user.User;
import com.example.demo.repository.data.CommentRepository;
import com.example.demo.repository.data.CommentRepository;
import com.example.demo.repository.data.CourseRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.repository.data.EnrollmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class CommentService {

    @Autowired
    private com.example.demo.repository.data.CommentRepository commentRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EnrollmentRepository enrollmentRepository;

    // Lấy tất cả bình luận gốc và trả lời của một khóa học
    public List<Comment> getCommentsByCourseId(Integer courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));
        return commentRepository.findByCourseAndParentCommentIsNullOrderByCreatedAtAsc(course);
    }

    // Thêm một bình luận mới (có thể là bình luận gốc hoặc trả lời)
    public Comment addComment(Integer courseId, Integer userId, String content, Integer parentCommentId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Kiểm tra xem người dùng đã enroll vào khóa học chưa
        boolean isEnrolled = enrollmentRepository.existsByUserAndCourse(user, course);
        if (!isEnrolled) {
            throw new RuntimeException("User is not enrolled in this course");
        }

        Comment parentComment = null;
        if (parentCommentId != null) {
            parentComment = commentRepository.findById(parentCommentId)
                    .orElseThrow(() -> new RuntimeException("Parent comment not found"));
        }

        Comment comment = Comment.builder()
                .content(content)
                .createdAt(LocalDateTime.now())
                .course(course)
                .user(user)
                .parentComment(parentComment)
                .build();

        return commentRepository.save(comment);
    }
    public List<Comment> getRecentComments(int limit) {
        return commentRepository.findTopByOrderByCreatedAtDesc(limit);
    }
}
