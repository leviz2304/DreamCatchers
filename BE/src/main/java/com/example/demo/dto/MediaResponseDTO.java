package com.example.demo.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MediaResponseDTO {
    private String url;
    private String fileName;
}
