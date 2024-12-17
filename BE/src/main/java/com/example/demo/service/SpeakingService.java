// src/main/java/com/example/demo/service/SpeakingService.java

package com.example.demo.service;

import com.example.demo.cloudinary.CloudService;
import com.example.demo.dto.AIChatRequestDTO;
import com.example.demo.dto.SpeakingFeedbackDTO;
import com.example.demo.entity.data.SpeakingFeedback;
import com.example.demo.entity.data.SpeakingQuestion;
import com.example.demo.entity.data.SpeakingTopic;
import com.example.demo.entity.user.User;
import com.example.demo.repository.data.SpeakingFeedbackRepository;
import com.example.demo.repository.data.SpeakingQuestionRepository;
import com.example.demo.repository.data.SpeakingTopicRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SpeakingService {

    private final SpeakingTopicRepository speakingTopicRepository;
    private final SpeakingQuestionRepository speakingQuestionRepository;
    private final SpeakingFeedbackRepository speakingFeedbackRepository;
    private final UserRepository userRepository;
    private final SpeechToTextService speechToTextService;
    private final AIFeedbackService aiFeedbackService;
    private final CloudService cloudService;
    private final AudioStorageService audioStorageService;
    private final AIFeedBackService2 aiFeedBackService2;
    // CRUD for Speaking Topics
    public SpeakingTopic createSpeakingTopic(SpeakingTopic topic) {
        if (speakingTopicRepository.existsByName(topic.getName())) {
            throw new IllegalArgumentException("Topic with this name already exists.");
        }
        return speakingTopicRepository.save(topic);
    }
    public SpeakingQuestion getQuestionById(int questionId) {
        return speakingQuestionRepository.findById(questionId)
                .orElseThrow(() -> new ResourceNotFoundException("SpeakingQuestion", "id", questionId));
    }

    public SpeakingTopic updateSpeakingTopic(int id, SpeakingTopic updatedTopic) {
        SpeakingTopic topic = speakingTopicRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("SpeakingTopic", "id", id));
        topic.setName(updatedTopic.getName());
        return speakingTopicRepository.save(topic);
    }

    public void deleteSpeakingTopic(int id) {
        SpeakingTopic topic = speakingTopicRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("SpeakingTopic", "id", id));
        speakingTopicRepository.delete(topic);
    }

    public List<SpeakingTopic> getAllSpeakingTopics() {
        return speakingTopicRepository.findAll();
    }

    // CRUD for Speaking Questions
    public SpeakingQuestion createSpeakingQuestion(int topicId, SpeakingQuestion question) {
        SpeakingTopic topic = speakingTopicRepository.findById(topicId)
                .orElseThrow(() -> new ResourceNotFoundException("SpeakingTopic", "id", topicId));
        question.setTopic(topic);
        return speakingQuestionRepository.save(question);
    }

    public SpeakingQuestion updateSpeakingQuestion(int id, SpeakingQuestion updatedQuestion) {
        SpeakingQuestion question = speakingQuestionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("SpeakingQuestion", "id", id));
        question.setQuestionText(updatedQuestion.getQuestionText());
        return speakingQuestionRepository.save(question);
    }

    public void deleteSpeakingQuestion(int id) {
        SpeakingQuestion question = speakingQuestionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("SpeakingQuestion", "id", id));
        speakingQuestionRepository.delete(question);
    }

    public List<SpeakingQuestion> getAllQuestionsByTopic(int topicId) {
        return speakingQuestionRepository.findByTopicId(topicId);
    }

    // Submit Speaking Response
    public SpeakingFeedback submitSpeakingResponse(int userId, int questionId, MultipartFile audioFile) throws IOException {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        SpeakingQuestion question = speakingQuestionRepository.findById(questionId)
                .orElseThrow(() -> new ResourceNotFoundException("SpeakingQuestion", "id", questionId));

        // Bước 1: Tải lên âm thanh tới Google Cloud Storage
        String audioUrl = audioStorageService.uploadAudio(
                audioFile.getBytes(),
                audioFile.getOriginalFilename(),
                audioFile.getContentType()
        );
        if (audioUrl == null) {
            throw new RuntimeException("Không thể tải lên âm thanh.");
        }

        // Bước 2: Chuyển đổi âm thanh thành văn bản
        String transcript;
        try {
            transcript = speechToTextService.transcribeAudio(audioFile.getBytes());
        } catch (Exception e) {
            throw new RuntimeException("Failed to transcribe audio.", e);
        }

        // Bước 3: Tạo phản hồi sử dụng AI
        SpeakingFeedbackDTO feedbackDTO = aiFeedbackService.generateFeedback(
                transcript,
                question.getQuestionText(),
                question.getTopic().getName()
        );
        if (feedbackDTO == null) {
            throw new RuntimeException("Không thể tạo phản hồi.");
        }

        // Bước 4: Lưu phản hồi
        SpeakingFeedback feedback = SpeakingFeedback.builder()
                .user(user)
                .question(question)
                .transcript(transcript)
                .feedbackJson(feedbackDTO.toJson())
                .submissionTime(LocalDateTime.now())
                .audioUrl(audioUrl)
                .build();

        return speakingFeedbackRepository.save(feedback);
    }

    // Retrieve Feedbacks
    public List<SpeakingFeedback> getUserSpeakingFeedbacks(int userId) {
        return speakingFeedbackRepository.findByUserId(userId);
    }
    public String generateAnswer(AIChatRequestDTO chatRequest) {
        return aiFeedBackService2.generateAnswer(chatRequest);
    }
}
