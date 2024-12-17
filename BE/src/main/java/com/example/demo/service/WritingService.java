package com.example.demo.service;

import com.example.demo.entity.data.*;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.repository.data.*;
import com.example.demo.dto.*;
import com.example.demo.entity.user.User;
import com.example.demo.repository.UserRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WritingService {

    private final WritingTaskRepository writingTaskRepository;
    private final UserEssayRepository userEssayRepository;
    private final UserRepository userRepository;
    private final ExternalEssayEvaluationService externalEssayEvaluationService; // We'll need to implement this

    public WritingTask getWritingTaskById(int id) {
        return writingTaskRepository.findById(id).orElse(null);
    }

    public List<WritingTask> getAllWritingTasks() {
        return writingTaskRepository.findAll();
    }


    @Transactional
    public UserEssay submitEssay(Integer userId, Integer writingTaskId, String essayContent) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        WritingTask task = writingTaskRepository.findById(writingTaskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));

        EssayFeedback feedback = externalEssayEvaluationService.evaluateEssay(task.getPrompt(), essayContent);
        double overallScore = feedback.getOverallScore();

        UserEssay userEssay = UserEssay.builder()
                .user(user)
                .writingTask(task)
                .content(essayContent)
                .submissionTime(LocalDateTime.now())
                .feedbackJson(convertFeedbackToJson(feedback)) // Lưu dưới dạng JSON
                .score(overallScore)
                .build();

        return userEssayRepository.save(userEssay);
    }

    public long getUserEssayCount(int userId) {
        return userEssayRepository.countUserEssaysByUserId(userId);
    }

    public Double getUserAverageEssayScore(int userId) {
        return userEssayRepository.findAverageEssayScoreByUserId(userId);
    }

    public long getTotalEssayCount() {
        return userEssayRepository.countAllEssays();
    }

    public Double getAverageEssayScore() {
        return userEssayRepository.findAverageEssayScore();
    }

    public List<UserEssay> getAllEssays() {
        return userEssayRepository.findAllEssaysOrderedBySubmissionTime();
    }

    public List<UserEssayDTO> getAllEssaysWithUserNames() {
        List<UserEssayDTO> essays = userEssayRepository.findAllEssaysWithUserNames();
        return essays.stream().map(essay -> new UserEssayDTO(
                essay.getId(),
                essay.getContent(),
                essay.getSubmissionTime(),
                essay.getScore(),
                essay.getEmail()
        )).collect(Collectors.toList());
    }

    public List<UserEssay> getUserEssays(int userId) {
        return userEssayRepository.findUserEssaysByUserId(userId);
    }

    private String convertFeedbackToJson(EssayFeedback feedback) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            return mapper.writeValueAsString(feedback);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Error converting feedback to JSON.");
        }
    }

    public WritingTask createWritingTask(WritingTask writingTask) {
        return writingTaskRepository.save(writingTask);
    }

    public WritingTask updateWritingTask(int id, WritingTask updatedTask) {
        WritingTask existingTask = writingTaskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));
        existingTask.setTitle(updatedTask.getTitle());
        existingTask.setPrompt(updatedTask.getPrompt());
        existingTask.setTaskType(updatedTask.getTaskType());
        return writingTaskRepository.save(existingTask);
    }

    public void deleteWritingTask(int id) {
        WritingTask task = writingTaskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));
        writingTaskRepository.delete(task);
    }

    public Page<UserEssay> getUserEssays(Integer userId, Pageable pageable) {
        return userEssayRepository.findAllByUserId(userId, pageable);
        // Additional methods as needed
    }
    public UserEssay getEssayById(Integer essayId) {
        return userEssayRepository.findById(essayId)
                .orElseThrow(() -> new ResourceNotFoundException("UserEssay", "id", essayId));
    }
    public List<UserEssay> getUserEssays(Integer userId) {
        return userEssayRepository.findAllByUserId(userId);
    }

}
