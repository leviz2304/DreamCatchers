package com.example.demo.controller.PrivateController;

import com.example.demo.dto.ResponseObject;
import com.example.demo.dto.UserDTO;
import com.example.demo.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
@RestController
@RequestMapping("/api/v1/private/chat")
@RequiredArgsConstructor
public class ChatListController {
    private final ChatService chatService;

    /**
     * API: Lấy danh sách Instructor mà user có thể chat (từ các khóa học đã đăng ký)
     * URL: /api/v1/private/chat/instructors/{userId}
     */
    @GetMapping("/instructors/{userId}")
    public ResponseEntity<ResponseObject> getInstructorsForUser(@PathVariable Integer userId) {
        List<UserDTO> instructors = chatService.getInstructorsForUser(userId);
        return ResponseEntity.ok(
                ResponseObject.builder()
                        .status(HttpStatus.valueOf(200))
                        .mess("Danh sách instructor của user")
                        .content(instructors)
                        .build()
        );
    }

    /**
     * API: Lấy danh sách học viên của các khóa học mà instructor dạy
     * URL: /api/v1/private/chat/students/{tutorId}
     */
    @GetMapping("/students/{tutorId}")
    public ResponseEntity<ResponseObject> getStudentsForTutor(@PathVariable Integer tutorId) {
        List<UserDTO> students = chatService.getStudentsForTutor(tutorId);
        return ResponseEntity.ok(
                ResponseObject.builder()
                        .status(HttpStatus.valueOf(200))
                        .mess("Danh sách học viên của instructor")
                        .content(students)
                        .build()
        );
    }
}
