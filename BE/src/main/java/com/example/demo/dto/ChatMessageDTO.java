package com.example.demo.dto;

import lombok.Data;

@Data
public class ChatMessageDTO {
    private Integer sender;
    private Integer receiver;
    private String content;
}
