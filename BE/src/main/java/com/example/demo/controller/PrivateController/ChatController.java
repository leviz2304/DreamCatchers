package com.example.demo.controller.PrivateController;

import com.example.demo.dto.MessageDTO;
import com.example.demo.dto.MessagePayload;
import com.example.demo.entity.data.Message;
import com.example.demo.service.MessageService;
import com.example.demo.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.security.Principal;

@Controller
@RequiredArgsConstructor
public class ChatController {

    private final MessageService messageService;
    private final UserService userService;
    private final SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/chat.sendMessage")
    public void sendMessage(MessagePayload payload, Principal principal) {
        // principal.getName() → email user
        String email = principal.getName();
        // Lấy user từ email
        var sender = userService.findByEmail(email);

        Message savedMsg = messageService.saveMessage(payload, sender.getId());
        MessageDTO dto = MessageDTO.fromEntity(savedMsg);

        // Gửi tin nhắn tới receiver: /user/{receiverId}/queue/chat/{courseId}
        String destination = "/user/" + dto.getReceiverId() + "/queue/chat/" + dto.getCourseId();
        messagingTemplate.convertAndSend(destination, dto);
    }
}