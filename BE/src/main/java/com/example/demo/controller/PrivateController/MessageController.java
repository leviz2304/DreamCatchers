package com.example.demo.controller.PrivateController;

import com.example.demo.dto.MessageDTO;
import com.example.demo.entity.data.Message;
import com.example.demo.service.MessageService;
import com.example.demo.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/private/messages")
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;
    private final UserService userService;

    // GET /messages/{userId}/{contactId}?courseId=...
    @GetMapping("/{userId}/{contactId}")
    public List<MessageDTO> getConversation(
            @PathVariable Integer userId,
            @PathVariable Integer contactId,
            @RequestParam Integer courseId
    ) {
        List<Message> msgs = messageService.getConversation(courseId, userId, contactId);
        return msgs.stream().map(MessageDTO::fromEntity).collect(Collectors.toList());
    }
}
