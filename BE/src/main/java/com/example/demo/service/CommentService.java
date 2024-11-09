package com.example.demo.service;

import com.example.demo.dto.CommentDTO;
import com.example.demo.dto.ResponseObject;
import com.example.demo.entity.data.Comment;
import com.example.demo.entity.data.Notification;
import com.example.demo.repository.UserRepository;
import com.example.demo.repository.data.CommentRepository;
import com.example.demo.repository.data.LessonRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class CommentService {
    private final UserRepository userRepository;
    private  final CommentRepository commentRepository;
    private  final LessonRepository lessonRepository;

    public Comment getById(int id) {
        return commentRepository.findById(id).orElse(null);
    }

    public void deleteById(int id) {
        var comment = commentRepository.findById(id).orElse(null);
        if (comment == null) {
            return ;
        }
        List<Comment> subComments = commentRepository.findAllByParentId(id);

        if(!subComments.isEmpty()) {
            for (Comment subComment : subComments) {
                subComment.getUser().getComments().remove(subComment);
                commentRepository.delete(subComment);
            }
        }
        commentRepository.delete(comment);
    }
    public Notification saveNotification(CommentDTO commentDTO) {
        var sendToUser = userRepository.findByEmail(commentDTO.getReplyToUser()).orElse(null);
        if (sendToUser == null) {
            System.out.println("sendToUser not found");
            return null;
        }
        Notification notification = Notification.builder()
                .content(commentDTO.getContent())
                .date(LocalDateTime.now())
                .fromUser(commentDTO.getUserName())
                .user(sendToUser)
                .img(commentDTO.getAvatar())
                .path(commentDTO.getPath())
                .content("Mentioned you in a comment")
                .build();
        if(notification == null)
        {
            System.out.println("Notification is null");
        }
        sendToUser.getNotifications().add(notification);
        userRepository.save(sendToUser);
        return notification;
    }

    public Comment saveComment(CommentDTO commentDTO) {
        var user = userRepository.findByEmail(commentDTO.getEmail()).orElse(null);
        var lesson = lessonRepository.findById(commentDTO.getLessonId()).orElse(null);
        if (user == null || lesson == null) {
            System.out.println("user || lesson not found");
            return null;
        }
        Comment comment = Comment.builder()
                .userEmail(commentDTO.getEmail())
                .userName(commentDTO.getUserName())
                .avatar(commentDTO.getAvatar())
                .user(user)
                .content(commentDTO.getContent())
                .lesson(lesson)
                .parentId(commentDTO.getParentId())
                .date(LocalDateTime.now())
                .replyToUser(commentDTO.getReplyToUser())
                .replyToUserName(commentDTO.getReplyToUserName())
                .build();
        return commentRepository.save(comment);
    }

    public ResponseObject getCommentByLessonId(int lessonId) {
        var comments = commentRepository.findAllByLessonId(lessonId, PageRequest.of(0, Integer.MAX_VALUE));
        return ResponseObject.builder().status(HttpStatus.OK).content(comments).build();
    }
}
