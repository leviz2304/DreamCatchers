package com.example.demo.dto;

import com.example.demo.entity.data.Message;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class MessageDTO {
    private Integer id;
    private Integer senderId;
    private Integer receiverId;
    private Integer courseId;
    private String content;
    private LocalDateTime timestamp;

    public static MessageDTO fromEntity(Message m) {
        MessageDTO dto = new MessageDTO();
        dto.setId(m.getId());
        dto.setSenderId(m.getSender().getId());
        dto.setReceiverId(m.getReceiver().getId());
        dto.setCourseId(m.getCourse().getId());
        dto.setContent(m.getContent());
        dto.setTimestamp(m.getTimestamp());
        return dto;
    }
}
