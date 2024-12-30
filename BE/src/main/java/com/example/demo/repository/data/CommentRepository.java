// src/main/java/com/example/demo/repository/CommentRepository.java
package com.example.demo.repository.data;

import com.example.demo.entity.data.Comment;
import com.example.demo.entity.data.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Integer> {

    // Lấy tất cả các bình luận gốc (không có parentComment) của một khóa học, sắp xếp theo thời gian tạo
    List<Comment> findByCourseAndParentCommentIsNullOrderByCreatedAtAsc(Course course);
    @Query(value = "SELECT c FROM Comment c ORDER BY c.createdAt DESC")
    List<Comment> findTopByOrderByCreatedAtDesc(int limit);
}
