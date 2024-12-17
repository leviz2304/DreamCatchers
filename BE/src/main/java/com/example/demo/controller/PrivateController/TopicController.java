package com.example.demo.controller.PrivateController;

import com.example.demo.dto.TopicDTO;
import com.example.demo.service.PronunciationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/private/topics")
public class TopicController {

    private final PronunciationService pronunciationService;

    public TopicController(PronunciationService pronunciationService) {
        this.pronunciationService = pronunciationService;
    }

    // Tạo mới Topic
    @PostMapping
    public ResponseEntity<TopicDTO> createTopic(@RequestBody TopicDTO topicDTO) {
        TopicDTO createdTopic = pronunciationService.createTopic(topicDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdTopic);
    }

    // Lấy tất cả Topic
    @GetMapping
    public ResponseEntity<List<TopicDTO>> getAllTopics() {
        List<TopicDTO> topics = pronunciationService.getAllTopics();
        return ResponseEntity.ok(topics);
    }

    // Lấy chi tiết một Topic theo ID
    @GetMapping("/{topicId}")
    public ResponseEntity<TopicDTO> getTopicById(@PathVariable Integer topicId) {
        TopicDTO topic = pronunciationService.getTopicById(topicId);
        return ResponseEntity.ok(topic);
    }

    // Cập nhật một Topic theo ID
    @PutMapping("/{topicId}")
    public ResponseEntity<TopicDTO> updateTopic(@PathVariable Integer topicId, @RequestBody TopicDTO topicDTO) {
        TopicDTO updatedTopic = pronunciationService.updateTopic(topicId, topicDTO);
        return ResponseEntity.ok(updatedTopic);
    }

    // Xóa một Topic theo ID
    @DeleteMapping("/{topicId}")
    public ResponseEntity<?> deleteTopic(@PathVariable Integer topicId) {
        pronunciationService.deleteTopic(topicId);
        return ResponseEntity.noContent().build();
    }
}