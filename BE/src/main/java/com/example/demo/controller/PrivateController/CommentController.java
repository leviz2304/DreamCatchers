// src/main/java/com/example/demo/controller/CommentController.java
package com.example.demo.controller.PrivateController;

import com.example.demo.dto.CommentDTO;
import com.example.demo.entity.data.Comment;
import com.example.demo.entity.user.User;
import com.example.demo.service.CommentService;
import com.example.demo.service.UserService;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.*;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/private/comments")
public class CommentController {

    @Autowired
    private CommentService commentService;
    @Autowired
    private UserService userService;
    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    // Lấy tất cả bình luận của một khóa học
    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<CommentDTO>> getCommentsByCourse(@PathVariable Integer courseId) {
        List<Comment> comments = commentService.getCommentsByCourseId(courseId);
        List<CommentDTO> commentDTOs = comments.stream()
                .map(CommentDTO::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(commentDTOs);
    }

    // Thêm một bình luận mới hoặc trả lời
    @PostMapping("/course/{courseId}")
    public ResponseEntity<CommentDTO> addComment(
            @PathVariable Integer courseId,
            @RequestBody CommentRequest commentRequest,
            Principal principal) {
        // Lấy userId từ Principal
        String email = principal.getName(); // Lấy email từ principal
        User user = userService.findByEmail(email); // Tìm user trong DB bằng email
        Integer userId = user.getId(); // Lấy id từ đối tượng user
        String content = commentRequest.getContent();
        Integer parentCommentId = commentRequest.getParentCommentId();

        Comment comment = commentService.addComment(courseId, userId, content, parentCommentId);
        CommentDTO commentDTO = CommentDTO.fromEntity(comment);

        // Gửi bình luận mới tới tất cả người dùng đang xem khóa học này qua WebSocket
        messagingTemplate.convertAndSend("/topic/comments/" + courseId, commentDTO);

        return ResponseEntity.ok(commentDTO);
    }

    // DTO cho yêu cầu thêm bình luận
    @Data
    public static class CommentRequest {
        private String content;
        private Integer parentCommentId; // null nếu là bình luận gốc
    }
}
