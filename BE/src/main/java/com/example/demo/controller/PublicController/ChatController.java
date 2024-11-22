package com.example.demo.controller.PublicController;

import com.example.demo.dto.ChatMessageDTO;
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

import java.util.List;

@Controller
@RequiredArgsConstructor
public class ChatController {

    private final MessageService messageService;
    private final SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/chat")
    public void sendMessage(@Payload ChatMessageDTO chatMessage) {
        // Save the message to the database
        messageService.sendMessage(chatMessage.getSenderId(), chatMessage.getReceiverId(), chatMessage.getContent());

        // Send the message to the specific user
        messagingTemplate.convertAndSendToUser(
                chatMessage.getReceiverId().toString(), // Use receiver's unique identifier
                "/queue/messages",
                chatMessage
        );
    }

    @GetMapping("/messages/{senderId}/{receiverId}")
    public ResponseEntity<List<Message>> getMessagesBetweenUsers(
            @PathVariable Integer senderId,
            @PathVariable Integer receiverId
    ) {
        List<Message> messages = messageService.getMessagesBetweenUsers(senderId, receiverId);
        return ResponseEntity.ok(messages);
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
