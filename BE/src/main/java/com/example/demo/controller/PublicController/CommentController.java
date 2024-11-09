package com.example.demo.controller.PublicController;

import com.example.demo.dto.CommentDTO;
import com.example.demo.entity.data.Comment;
import com.example.demo.entity.data.Notification;
import com.example.demo.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.Message;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.Objects;

@Controller
@RequiredArgsConstructor
public class CommentController {
    private final CommentService commentService;

    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;

    @MessageMapping("/comment/lesson/{lessonId}")
    @SendTo("/comment/lesson/{lessonId}")
    public Comment handleComment(@Payload CommentDTO commentDTO, @DestinationVariable int lessonId) throws Exception {
        if (commentDTO == null) {
            throw new IllegalArgumentException("CommentDTO cannot be null");
        }

        if(commentDTO.getReplyToUser() != null && !Objects.equals(commentDTO.getEmail(), commentDTO.getReplyToUser())) {
            Notification notification = commentService.saveNotification(commentDTO);
            var alias = notification.getUser().getEmail().split("@")[0];
            simpMessagingTemplate.convertAndSendToUser(alias,"/notification", notification);
        }
        return commentService.saveComment(commentDTO);
    }

}
