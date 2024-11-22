package com.example.demo.controller.PrivateController;

import com.example.demo.dto.UserDTO;
import com.example.demo.entity.user.User;
import com.example.demo.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/private/instructor")
@RequiredArgsConstructor
public class InstructorController {
    private final ChatService chatService;

    @GetMapping("/{userId}")
    public ResponseEntity<List<UserDTO>> getInstructorsForUser(@PathVariable Integer userId) {
        // Directly return the list of UserDTOs from the service
        List<UserDTO> instructors = chatService.getInstructorsForUserCourses(userId);
        return ResponseEntity.ok(instructors);
    }
}
