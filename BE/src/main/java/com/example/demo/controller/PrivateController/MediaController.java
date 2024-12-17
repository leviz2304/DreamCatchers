package com.example.demo.controller;

import com.example.demo.dto.MediaResponseDTO;
import com.example.demo.dto.ResponseObject;
import com.example.demo.service.MediaStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1/private/media")
@RequiredArgsConstructor
public class MediaController {

    private final MediaStorageService mediaStorageService;

    // Endpoint để upload video
    @PostMapping("/upload-video")
    public ResponseEntity<ResponseObject> uploadVideo(@RequestParam("file") MultipartFile file) {
        try {
            MediaResponseDTO response = mediaStorageService.uploadFile(file, "videos");
            return ResponseEntity.status(HttpStatus.OK)
                    .body(ResponseObject.builder()
                            .status(HttpStatus.OK)
                            .mess("Video uploaded successfully")
                            .content(response)
                            .build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ResponseObject.builder()
                            .status(HttpStatus.BAD_REQUEST)
                            .mess("Failed to upload video: " + e.getMessage())
                            .content(null)
                            .build());
        }
    }

    // Endpoint để upload thumbnail
    @PostMapping("/upload-thumbnail")
    public ResponseEntity<ResponseObject> uploadThumbnail(@RequestParam("file") MultipartFile file) {
        try {
            MediaResponseDTO response = mediaStorageService.uploadFile(file, "thumbnails");
            return ResponseEntity.status(HttpStatus.OK)
                    .body(ResponseObject.builder()
                            .status(HttpStatus.OK)
                            .mess("Thumbnail uploaded successfully")
                            .content(response)
                            .build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ResponseObject.builder()
                            .status(HttpStatus.BAD_REQUEST)
                            .mess("Failed to upload thumbnail: " + e.getMessage())
                            .content(null)
                            .build());
        }
    }
}
