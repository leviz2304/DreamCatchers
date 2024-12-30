// src/main/java/com/example/demo/dto/CommentDTO.java
package com.example.demo.dto;

import com.example.demo.entity.data.Comment;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Data
public class CommentDTO {
    private Integer id;
    private String content;
    private LocalDateTime createdAt;
    private String userName;
    private String avatar;
    private List<CommentDTO> replies;
    private Integer parentCommentId;
    // Chuyển đổi từ entity sang DTO
    public static CommentDTO fromEntity(Comment comment) {
        CommentDTO dto = new CommentDTO();
        dto.setId(comment.getId());
        dto.setContent(comment.getContent());
        dto.setCreatedAt(comment.getCreatedAt());
        dto.setUserName(comment.getUser().getUsername()); // Giả sử bạn có phương thức getUsername
        dto.setAvatar(comment.getUser().getAvatar()); // Giả sử bạn có trường avatar trong User
        dto.setParentCommentId(comment.getParentComment() == null ? null : comment.getParentComment().getId());
        if (comment.getReplies() != null && !comment.getReplies().isEmpty()) {
            dto.setReplies(comment.getReplies().stream()
                    .map(CommentDTO::fromEntity)
                    .collect(Collectors.toList()));
        }
        return dto;
    }
}
