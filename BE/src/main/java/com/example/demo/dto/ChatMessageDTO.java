package com.example.demo.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
@Getter
@Setter
@Data
public class ChatMessageDTO {
    private Integer senderId;
    private Integer receiverId;
    private String content;
    private LocalDateTime timestamp; // Add timestamp if needed
}

