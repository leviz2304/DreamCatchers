// src/main/java/com/example/demo/controller/PrivateController/SpeakingController.java

package com.example.demo.controller.PrivateController;

import com.example.demo.entity.data.SpeakingFeedback;
import com.example.demo.entity.data.SpeakingQuestion;
import com.example.demo.entity.data.SpeakingTopic;
import com.example.demo.service.SpeakingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
@Slf4j
@RestController
@RequestMapping("/api/v1/private/speaking")
@RequiredArgsConstructor
public class SpeakingController {

    private final SpeakingService speakingService;

    // CRUD for Speaking Topics

    @PostMapping("/topics")
    public ResponseEntity<SpeakingTopic> createSpeakingTopic(@RequestBody SpeakingTopic topic) {
        SpeakingTopic createdTopic = speakingService.createSpeakingTopic(topic);
        return ResponseEntity.ok(createdTopic);
    }

    @PutMapping("/topics/{id}")
    public ResponseEntity<SpeakingTopic> updateSpeakingTopic(@PathVariable int id, @RequestBody SpeakingTopic topic) {
        SpeakingTopic updatedTopic = speakingService.updateSpeakingTopic(id, topic);
        return ResponseEntity.ok(updatedTopic);
    }

    @DeleteMapping("/topics/{id}")
    public ResponseEntity<Void> deleteSpeakingTopic(@PathVariable int id) {
        speakingService.deleteSpeakingTopic(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/topics")
    public ResponseEntity<List<SpeakingTopic>> getAllSpeakingTopics() {
        List<SpeakingTopic> topics = speakingService.getAllSpeakingTopics();
        return ResponseEntity.ok(topics);
    }

    // CRUD for Speaking Questions

    @PostMapping("/topics/{topicId}/questions")
    public ResponseEntity<SpeakingQuestion> createSpeakingQuestion(@PathVariable int topicId, @RequestBody SpeakingQuestion question) {
        SpeakingQuestion createdQuestion = speakingService.createSpeakingQuestion(topicId, question);
        return ResponseEntity.ok(createdQuestion);
    }

    @PutMapping("/questions/{id}")
    public ResponseEntity<SpeakingQuestion> updateSpeakingQuestion(@PathVariable int id, @RequestBody SpeakingQuestion question) {
        SpeakingQuestion updatedQuestion = speakingService.updateSpeakingQuestion(id, question);
        return ResponseEntity.ok(updatedQuestion);
    }

    @DeleteMapping("/questions/{id}")
    public ResponseEntity<Void> deleteSpeakingQuestion(@PathVariable int id) {
        speakingService.deleteSpeakingQuestion(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/topics/{topicId}/questions")
    public ResponseEntity<List<SpeakingQuestion>> getAllQuestionsByTopic(@PathVariable int topicId) {
        List<SpeakingQuestion> questions = speakingService.getAllQuestionsByTopic(topicId);
        return ResponseEntity.ok(questions);
    }

    // Submit Speaking Response

    @PostMapping("/submit")
    public ResponseEntity<?> submitSpeakingResponse(
            @RequestParam int userId,
            @RequestParam int questionId,
            @RequestParam("audioFile") MultipartFile audioFile) {

        // Check file format
        String contentType = audioFile.getContentType();
        if (!"audio/wav".equals(contentType) && !"audio/mp3".equals(contentType)) {
            return ResponseEntity.badRequest().body("Unsupported audio format: " + contentType);
        }

        try {
            SpeakingFeedback feedback = speakingService.submitSpeakingResponse(userId, questionId, audioFile);
            return ResponseEntity.ok(feedback);
        } catch (Exception e) {
            // Log the full stack trace for debugging
            log.error("Error processing speaking response", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to process submission: " + e.getMessage());
        }
    }



    // Retrieve User Feedbacks

    @GetMapping("/feedbacks/{userId}")
    public ResponseEntity<List<SpeakingFeedback>> getUserSpeakingFeedbacks(@PathVariable int userId) {
        List<SpeakingFeedback> feedbacks = speakingService.getUserSpeakingFeedbacks(userId);
        return ResponseEntity.ok(feedbacks);
    }
}
