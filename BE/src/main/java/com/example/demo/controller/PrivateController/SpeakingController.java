// src/main/java/com/example/demo/controller/PrivateController/SpeakingController.java

package com.example.demo.controller.PrivateController;

import com.example.demo.dto.AIChatRequestDTO;
import com.example.demo.dto.ResponseObject;
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

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/v1/private/speaking")
@RequiredArgsConstructor
public class SpeakingController {

    private final SpeakingService speakingService;

    // CRUD for Speaking Topics

    @PostMapping("/topics")
    public ResponseEntity<ResponseObject> createSpeakingTopic(@RequestBody SpeakingTopic topic) {
        SpeakingTopic createdTopic = speakingService.createSpeakingTopic(topic);
        return ResponseEntity.ok(ResponseObject.builder()
                .status(HttpStatus.OK)
                .mess("Topic created successfully.")
                .content(createdTopic)
                .build());
    }

    @PutMapping("/topics/{id}")
    public ResponseEntity<ResponseObject> updateSpeakingTopic(@PathVariable int id, @RequestBody SpeakingTopic topic) {
        SpeakingTopic updatedTopic = speakingService.updateSpeakingTopic(id, topic);
        return ResponseEntity.ok(ResponseObject.builder()
                .status(HttpStatus.OK)
                .mess("Topic updated successfully.")
                .content(updatedTopic)
                .build());
    }

    @DeleteMapping("/topics/{id}")
    public ResponseEntity<ResponseObject> deleteSpeakingTopic(@PathVariable int id) {
        speakingService.deleteSpeakingTopic(id);
        return ResponseEntity.ok(ResponseObject.builder()
                .status(HttpStatus.OK)
                .mess("Topic deleted successfully.")
                .content(null)
                .build());
    }

    @GetMapping("/topics")
    public ResponseEntity<ResponseObject> getAllSpeakingTopics() {
        List<SpeakingTopic> topics = speakingService.getAllSpeakingTopics();
        return ResponseEntity.ok(ResponseObject.builder()
                .status(HttpStatus.OK)
                .mess("Success")
                .content(topics)
                .build());
    }

    // CRUD for Speaking Questions

    @PostMapping("/topics/{topicId}/questions")
    public ResponseEntity<ResponseObject> createSpeakingQuestion(@PathVariable int topicId, @RequestBody SpeakingQuestion question) {
        SpeakingQuestion createdQuestion = speakingService.createSpeakingQuestion(topicId, question);
        return ResponseEntity.ok(ResponseObject.builder()
                .status(HttpStatus.OK)
                .mess("Question created successfully.")
                .content(createdQuestion)
                .build());
    }

    @PutMapping("/questions/{id}")
    public ResponseEntity<ResponseObject> updateSpeakingQuestion(@PathVariable int id, @RequestBody SpeakingQuestion question) {
        SpeakingQuestion updatedQuestion = speakingService.updateSpeakingQuestion(id, question);
        return ResponseEntity.ok(ResponseObject.builder()
                .status(HttpStatus.OK)
                .mess("Question updated successfully.")
                .content(updatedQuestion)
                .build());
    }

    @DeleteMapping("/questions/{id}")
    public ResponseEntity<ResponseObject> deleteSpeakingQuestion(@PathVariable int id) {
        speakingService.deleteSpeakingQuestion(id);
        return ResponseEntity.ok(ResponseObject.builder()
                .status(HttpStatus.OK)
                .mess("Question deleted successfully.")
                .content(null)
                .build());
    }

    @GetMapping("/topics/{topicId}/questions")
    public ResponseEntity<ResponseObject> getAllQuestionsByTopic(@PathVariable int topicId) {
        List<SpeakingQuestion> questions = speakingService.getAllQuestionsByTopic(topicId);
        return ResponseEntity.ok(ResponseObject.builder()
                .status(HttpStatus.OK)
                .mess("Success")
                .content(questions)
                .build());
    }

    // Get question by ID
    @GetMapping("/questions/{questionId}")
    public ResponseEntity<ResponseObject> getQuestionById(@PathVariable int questionId) {
        SpeakingQuestion question = speakingService.getQuestionById(questionId);
        return ResponseEntity.ok(ResponseObject.builder()
                .status(HttpStatus.OK)
                .mess("Success")
                .content(question)
                .build());
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

    // AI Chat for Answer Suggestions
    @PostMapping("/generate-answer")
    public ResponseEntity<ResponseObject> generateAnswer(@RequestBody AIChatRequestDTO chatRequest) {
        try {
            String aiAnswer = speakingService.generateAnswer(chatRequest);
            return ResponseEntity.ok(ResponseObject.builder()
                    .status(HttpStatus.OK)
                    .mess("Answer generated successfully.")
                    .content(aiAnswer)
                    .build());
        } catch (Exception e) {
            log.error("Error generating answer", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ResponseObject.builder()
                            .status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .mess("Failed to generate answer.")
                            .content(null)
                            .build());
        }
    }
}
