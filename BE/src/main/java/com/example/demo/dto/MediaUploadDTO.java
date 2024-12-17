package com.example.demo.dto;

import lombok.*;
import org.springframework.web.multipart.MultipartFile;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MediaUploadDTO {
    private MultipartFile file;
}
