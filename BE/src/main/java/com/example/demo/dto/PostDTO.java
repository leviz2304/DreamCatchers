package com.example.demo.dto;


import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PostDTO {
    private String content;
    private String title;
    private String email;
}
