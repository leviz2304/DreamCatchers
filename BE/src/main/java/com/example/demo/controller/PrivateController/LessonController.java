package com.example.demo.controller.PrivateController;

import com.example.demo.dto.LessonProgressDTO;
import com.example.demo.entity.data.LessonProgress;
import com.example.demo.service.LessonProgressService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/private/lesson")
@RequiredArgsConstructor
public class LessonController {
    @Autowired
    private LessonProgressService lessonProgressService;

    @PostMapping("/progress")
    public ResponseEntity<?> updateProgress(@RequestBody LessonProgressDTO lessonProgressDTO) {
        lessonProgressService.updateProgress(
                lessonProgressDTO.getUserId(),
                lessonProgressDTO.getLessonId(),
                lessonProgressDTO.getProgressPercentage()
        );
        return ResponseEntity.ok().build();
    }

    @GetMapping("/course/{courseId}/progress/{userId}")
    public ResponseEntity<List<LessonProgressDTO>> getUserProgress(
            @PathVariable int courseId,
            @PathVariable int userId
    ) {
        List<LessonProgress> progressList = lessonProgressService.getUserProgressForCourse(userId, courseId);
        List<LessonProgressDTO> dtoList = progressList.stream().map(lp -> {
            LessonProgressDTO dto = new LessonProgressDTO();
            dto.setUserId(lp.getUser().getId());
            dto.setLessonId(lp.getLesson().getId());
            dto.setProgressPercentage(lp.getProgressPercentage());
            dto.setCompleted(lp.isCompleted());
            dto.setUnlocked(lp.isUnlocked());
            return dto;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(dtoList);
    }
}
