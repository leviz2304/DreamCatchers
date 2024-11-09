package com.example.demo.controller.PublicController;

import com.example.demo.dto.ResponseObject;
import com.example.demo.service.PostService;
import jakarta.mail.Multipart;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.AutoConfiguration;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1/public/post")
@NoArgsConstructor
public class PPostController {

    @Autowired
    private PostService postService;

    @PostMapping("/uploadImg")
    public ResponseEntity<ResponseObject> getTempImg(@RequestPart MultipartFile file) {
        var result = postService.uploadImg(file);
        return ResponseEntity.status(result.getStatus()).body(result);
    }

    @GetMapping("")
    public ResponseEntity<ResponseObject> getPost(@RequestParam int page, @RequestParam int size) {
        var result = postService.getPosts(page, size);
        return ResponseEntity.status(result.getStatus()).body(result);
    }
}
