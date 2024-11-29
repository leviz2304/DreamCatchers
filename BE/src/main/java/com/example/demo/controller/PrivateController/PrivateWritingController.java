package com.example.demo.controller.PrivateController;

import com.example.demo.dto.EssaySubmissionRequest;
import com.example.demo.dto.ResponseObject;
import com.example.demo.entity.data.UserEssay;
import com.example.demo.entity.data.WritingTask;
import com.example.demo.repository.data.UserEssayRepository;
import com.example.demo.service.WritingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/private/writing")
@RequiredArgsConstructor
public class PrivateWritingController {

    private final WritingService writingService;
    private final UserEssayRepository userEssayRepository;
    @PostMapping("/submit")
    public ResponseEntity<ResponseObject> submitEssay(@RequestBody EssaySubmissionRequest request) {

        UserEssay userEssay = writingService.submitEssay(
                request.getUserId(),
                request.getWritingTaskId(),
                request.getEssayContent()
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(
                ResponseObject.builder()
                        .status(HttpStatus.CREATED)
                        .mess("Essay submitted successfully")
                        .content(userEssay)
                        .build()
        );
    }
    @GetMapping("/essays/{userId}")
    public ResponseEntity<List<UserEssay>> getUserEssays(@PathVariable int userId) {
        List<UserEssay> essays = userEssayRepository.findAllByUserId(userId);
        return ResponseEntity.ok(essays);
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
