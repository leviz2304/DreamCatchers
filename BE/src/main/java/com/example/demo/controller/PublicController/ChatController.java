package com.example.demo.controller.PublicController;
import com.example.demo.dto.ChatMessageDTO;
import com.example.demo.entity.data.Message;
import com.example.demo.service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@Controller
@RequiredArgsConstructor
public class ChatController {

    private final MessageService messageService;

    @MessageMapping("/chat") // Prefix "/app" is automatically added
    @SendTo("/topic/messages") // Messages broadcasted to all subscribed users
    public ChatMessageDTO sendMessage(@Payload ChatMessageDTO chatMessage) {
        // Save the message to the database (if required)
        messageService.sendMessage(chatMessage.getSender(), chatMessage.getReceiver(), chatMessage.getContent());
        return chatMessage; // Broadcast the message
    }
    @GetMapping("/messages/{senderId}/{receiverId}")
    public ResponseEntity<List<Message>> getMessagesBetweenUsers(
            @PathVariable Integer senderId,
            @PathVariable Integer receiverId
    ) {
        List<com.example.demo.entity.data.Message> messages = messageService.getMessagesBetweenUsers(senderId, receiverId);
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