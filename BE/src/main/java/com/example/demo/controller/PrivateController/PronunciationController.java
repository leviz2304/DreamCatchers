package com.example.demo.controller.PrivateController;

import com.example.demo.dto.PronunciationAssessmentDTO;
import com.example.demo.dto.PronunciationResultDTO;
import com.example.demo.dto.SentenceDTO;
import com.example.demo.dto.TopicDTO;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.service.PronunciationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/private/pronunciation")
public class PronunciationController {

    @Autowired
    private PronunciationService pronunciationService;

    @PostMapping("/sentences")
    public ResponseEntity<SentenceDTO> createSentence(@RequestBody SentenceDTO sentenceDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(pronunciationService.createSentence(sentenceDTO));
    }

    @GetMapping("/sentences")
    public ResponseEntity<List<SentenceDTO>> getSentencesByTopic(@RequestParam Integer topicId) {
        return ResponseEntity.ok(pronunciationService.getSentencesByTopic(topicId));
    }

    @GetMapping("/sentences/{id}")
    public ResponseEntity<SentenceDTO> getSentenceById(@PathVariable Integer id) {
        return ResponseEntity.ok(pronunciationService.getSentenceById(id));
    }

    @PutMapping("/sentences/{id}")
    public ResponseEntity<SentenceDTO> updateSentence(@PathVariable Integer id, @RequestBody SentenceDTO sentenceDTO) {
        return ResponseEntity.ok(pronunciationService.updateSentence(id, sentenceDTO));
    }

    @DeleteMapping("/sentences/{id}")
    public ResponseEntity<Void> deleteSentence(@PathVariable Integer id) {
        pronunciationService.deleteSentence(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/sentences/{id}/upload-audio")
    public ResponseEntity<SentenceDTO> uploadAudio(
            @PathVariable Integer id,
            @RequestParam("audioFile") MultipartFile audioFile) {
        SentenceDTO updatedSentence = pronunciationService.uploadAudioForSentence(id, audioFile);
        return ResponseEntity.ok(updatedSentence);
    }

    @GetMapping("/sentences/{id}/audio")
    public ResponseEntity<Map<String, String>> getAudioUrl(@PathVariable Integer id) {
        SentenceDTO sentenceDTO = pronunciationService.getSentenceById(id);
        if (sentenceDTO.getAudioUrl() == null) {
            throw new ResourceNotFoundException("Audio not found for Sentence ID: " + id);
        }
        return ResponseEntity.ok(Map.of("audioUrl", sentenceDTO.getAudioUrl()));
    }
    // Tạo topic
    @PostMapping("/topics")
    public ResponseEntity<TopicDTO> createTopic(@RequestBody TopicDTO topicDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(pronunciationService.createTopic(topicDTO));
    }

    // Lấy danh sách tất cả các topic
    @GetMapping("/topics")
    public ResponseEntity<List<TopicDTO>> getAllTopics() {
        return ResponseEntity.ok(pronunciationService.getAllTopics());
    }

    // Lấy chi tiết của 1 topic
    @GetMapping("/topics/{id}")
    public ResponseEntity<TopicDTO> getTopicById(@PathVariable Integer id) {
        return ResponseEntity.ok(pronunciationService.getTopicById(id));
    }

    // Cập nhật topic
    @PutMapping("/topics/{id}")
    public ResponseEntity<TopicDTO> updateTopic(@PathVariable Integer id, @RequestBody TopicDTO topicDTO) {
        return ResponseEntity.ok(pronunciationService.updateTopic(id, topicDTO));
    }

    // Xóa topic
    @DeleteMapping("/topics/{id}")
    public ResponseEntity<Void> deleteTopic(@PathVariable Integer id) {
        pronunciationService.deleteTopic(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/assess")
    public ResponseEntity<PronunciationResultDTO> assessPronunciation(
            @RequestParam Integer userId,
            @RequestParam Integer sentenceId,
            @RequestParam("audioFile") MultipartFile audioFile) {
        PronunciationResultDTO result = pronunciationService.assessPronunciation(userId, sentenceId, audioFile);
        return ResponseEntity.ok(result);
    }

}
