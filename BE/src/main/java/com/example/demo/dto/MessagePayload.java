package com.example.demo.dto;

import lombok.Data;

@Data
public class MessagePayload {
    private Integer courseId;
    private Integer receiverId;
    private String content;
    // client gửi courseId, receiverId, content
}
