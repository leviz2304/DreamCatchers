package com.example.demo.controller.PrivateController;

import com.example.demo.dto.EssayFeedback;
import com.example.demo.dto.EssaySubmissionRequest;
import com.example.demo.dto.ResponseObject;
import com.example.demo.entity.data.UserEssay;
import com.example.demo.entity.data.WritingTask;
import com.example.demo.entity.user.User;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.repository.UserRepository;
import com.example.demo.repository.data.UserEssayRepository;
import com.example.demo.repository.data.WritingTaskRepository;
import com.example.demo.service.ExternalEssayEvaluationService;
import com.example.demo.service.WritingService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/v1/private/writing")
@RequiredArgsConstructor
public class PrivateWritingController {

    private final WritingService writingService;
    private final UserEssayRepository userEssayRepository;
    private final UserRepository userRepository;
    private final WritingTaskRepository writingTaskRepository;
    private final ExternalEssayEvaluationService externalEssayEvaluationService;
    @PostMapping("/submit")
    public ResponseEntity<ResponseObject> submitEssay(@Validated @RequestBody EssaySubmissionRequest request) {
        // Gọi service để xử lý việc gửi bài luận
        UserEssay userEssay = writingService.submitEssay(
                request.getUserId(),
                request.getWritingTaskId(),
                request.getEssayContent()
        );

        // Trả về phản hồi với thông tin bài luận đã được lưu
        return ResponseEntity.status(HttpStatus.CREATED).body(
                ResponseObject.builder()
                        .status(HttpStatus.CREATED)
                        .mess("Essay submitted successfully")
                        .content(userEssay)
                        .build()
        );

    }
    private String convertFeedbackToJson(EssayFeedback feedback) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            return mapper.writeValueAsString(feedback);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Error converting feedback to JSON.");
        }
    }

    @GetMapping("/essays/history")
    public ResponseEntity<ResponseObject> getUserEssayHistory(
            @RequestParam Integer userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<UserEssay> essays = writingService.getUserEssays(userId, PageRequest.of(page, size));
        return ResponseEntity.ok(
                ResponseObject.builder()
                        .status(HttpStatus.OK)
                        .mess("Essay history retrieved successfully")
                        .content(essays)
                        .build()
        );
    }



    // Endpoint to get a specific essay by ID (optional)
    @GetMapping("/essays/{essayId}")
    public ResponseEntity<ResponseObject> getEssayById(@PathVariable Integer essayId, Authentication authentication) {
        UserEssay essay = writingService.getEssayById(essayId);
        return ResponseEntity.ok(
                ResponseObject.builder()
                        .status(HttpStatus.OK)
                        .mess("Essay retrieved successfully")
                        .content(essay)
                        .build()
        );
    }


    @PostMapping("/tasks")
    public ResponseEntity<ResponseObject> createWritingTask(@RequestBody WritingTask writingTask) {
        WritingTask createdTask = writingService.createWritingTask(writingTask);
        return ResponseEntity.status(HttpStatus.CREATED).body(
                ResponseObject.builder()
                        .status(HttpStatus.CREATED)
                        .mess("Writing task created successfully")
                        .content(createdTask)
                        .build()
        );
    }

    @GetMapping("/tasks")
    public ResponseEntity<List<WritingTask>> getAllWritingTasks() {
        List<WritingTask> tasks = writingService.getAllWritingTasks();
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/tasks/{id}")
    public ResponseEntity<ResponseObject> getWritingTaskById(@PathVariable int id) {
        WritingTask task = writingService.getWritingTaskById(id);
        return ResponseEntity.ok(
                ResponseObject.builder()
                        .status(HttpStatus.OK)
                        .mess("Writing task retrieved successfully")
                        .content(task)
                        .build()
        );
    }

    @PutMapping("/tasks/{id}")
    public ResponseEntity<ResponseObject> updateWritingTask(@PathVariable int id, @RequestBody WritingTask updatedTask) {
        WritingTask task = writingService.updateWritingTask(id, updatedTask);
        return ResponseEntity.ok(
                ResponseObject.builder()
                        .status(HttpStatus.OK)
                        .mess("Writing task updated successfully")
                        .content(task)
                        .build()
        );
    }

    @DeleteMapping("/tasks/{id}")
    public ResponseEntity<ResponseObject> deleteWritingTask(@PathVariable int id) {
        writingService.deleteWritingTask(id);
        return ResponseEntity.ok(
                ResponseObject.builder()
                        .status(HttpStatus.OK)
                        .mess("Writing task deleted successfully")
                        .build()
        );
    }
}
