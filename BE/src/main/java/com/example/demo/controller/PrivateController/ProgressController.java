package com.example.demo.controller.PrivateController;

import com.example.demo.dto.LessonStatusDTO;
import com.example.demo.service.ProgressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/private/course")
public class ProgressController {
    @Autowired
    private ProgressService progressService;

    @PostMapping("/{courseId}/lesson/{lessonId}/progress")
    public ResponseEntity<?> updateLessonProgress(@PathVariable Integer courseId,
                                                  @PathVariable Integer lessonId,
                                                  @RequestParam Integer userId,
                                                  @RequestParam Double progress) {
        progressService.updateProgress(userId, lessonId, progress);
        return ResponseEntity.ok("Progress updated");
    }

    @GetMapping("/{courseId}/lessons-status")
    public ResponseEntity<List<LessonStatusDTO>> getLessonsStatus(@PathVariable Integer courseId,
                                                                  @RequestParam Integer userId) {
        List<LessonStatusDTO> statuses = progressService.getUserLessonStatuses(userId, courseId);
        return ResponseEntity.ok(statuses);
    }
}