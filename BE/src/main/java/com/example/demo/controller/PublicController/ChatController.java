package com.example.demo.controller.PublicController;

import com.example.demo.dto.ChatMessageDTO;
import com.example.demo.dto.UserDTO;
import com.example.demo.entity.data.Message;
import com.example.demo.service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
// Remove unused imports
// import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.stream.Collectors;

@RestController
public class ChatController {

    private final MessageService messageService;
    private final SimpMessagingTemplate messagingTemplate;
    public ChatController(MessageService messageService, SimpMessagingTemplate messagingTemplate) {
        this.messageService = messageService;
        this.messagingTemplate = messagingTemplate;
    }

    @MessageMapping("/chat")
    public void processMessage(@Payload ChatMessageDTO chatMessage, Principal principal) {
        System.out.println("Principal Name (should be senderId): " + principal.getName());

        // Save the message
        messageService.sendMessage(chatMessage.getSenderId(), chatMessage.getReceiverId(), chatMessage.getContent());

        // Send the message to the receiver
        messagingTemplate.convertAndSendToUser(
                chatMessage.getReceiverId().toString(),
                "/queue/messages",
                chatMessage
        );

        // Also send the message back to the sender
        messagingTemplate.convertAndSendToUser(
                principal.getName(), // This should be the sender's userId
                "/queue/messages",
                chatMessage
        );
    }


    @GetMapping("/students/{instructorId}")
    public ResponseEntity<List<UserDTO>> getStudentsForInstructor(@PathVariable Integer instructorId) {
        List<UserDTO> students = messageService.getStudentsForInstructor(instructorId);
        System.out.println(students);
        return ResponseEntity.ok(students);
    }
    @GetMapping("/messages/{userId1}/{userId2}")
    public ResponseEntity<List<ChatMessageDTO>> getMessagesBetweenUsers(
            @PathVariable Integer userId1,
            @PathVariable Integer userId2) {
        List<Message> messages = messageService.getMessagesBetweenUsers(userId1, userId2);
        List<ChatMessageDTO> messageDTOs = messages.stream()
                .map(ChatMessageDTO::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(messageDTOs);
    }


    @PutMapping("/messages/read")
    public ResponseEntity<Void> markMessagesAsRead(
            @RequestParam Integer receiverId,
            @RequestParam Integer senderId
    ) {
        messageService.markMessagesAsRead(receiverId, senderId);
        return ResponseEntity.noContent().build();
    }
}
