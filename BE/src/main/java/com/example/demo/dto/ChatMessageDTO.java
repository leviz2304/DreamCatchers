package com.example.demo.dto;

import com.example.demo.entity.data.Message;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
@Getter
@Setter
@Data
@NoArgsConstructor

public class ChatMessageDTO {
    private Integer senderId;
    private Integer receiverId;
    private String content;
    private LocalDateTime timestamp; // Add timestamp if needed
    public ChatMessageDTO(Message message) {
        this.senderId = message.getSender().getId();
        this.receiverId = message.getReceiver().getId();
        this.content = message.getContent();
        this.timestamp = message.getTimestamp();
    }
}

