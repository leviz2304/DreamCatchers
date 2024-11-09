package com.example.demo.service;

import com.example.demo.cloudinary.CloudService;
import com.example.demo.dto.PostDTO;
import com.example.demo.dto.ResponseObject;
import com.example.demo.entity.data.Post;
import com.example.demo.entity.user.User;
import com.example.demo.repository.data.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;

@Service
public class PostService {
    @Autowired
    private PostRepository postRepository;

    @Autowired
    private CloudService cloudService;

    public ResponseObject getPosts(int page, int size){
        return ResponseObject.builder().status(HttpStatus.OK).content(postRepository.findAll(PageRequest.of(page, size))).build();
    }

    public void savePost(User user, PostDTO postDTO) {
        Post post = Post.builder()
                .date(LocalDateTime.now())
                .title(postDTO.getTitle())
                .content(postDTO.getContent())
                .user(user)
                .build();
        postRepository.save(post);
    }

    public ResponseObject uploadImg(MultipartFile file) {
        String path = null;
        try {
            path = cloudService.uploadImage(file.getBytes());

        } catch (IOException ex) {
            System.out.println("uploadImg: " + ex.getMessage());
            return ResponseObject.builder().status(HttpStatus.BAD_REQUEST).mess("Error while upload image").build();
        }
        return ResponseObject.builder().status(HttpStatus.OK).content(path).mess("upload image successfully").build();
    }

}
