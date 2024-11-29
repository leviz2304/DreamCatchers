package com.example.demo.controller.PublicController;

import com.example.demo.entity.data.WritingTask;
import com.example.demo.service.WritingService;
import com.example.demo.dto.ResponseObject;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/public/writing")
@RequiredArgsConstructor
public class PublicWritingController {

    private final WritingService writingService;

    @GetMapping("")
    public ResponseEntity<ResponseObject> getAllWritingTasks() {
        List<WritingTask> tasks = writingService.getAllWritingTasks();
        return ResponseEntity.ok(ResponseObject.builder()
                .status(HttpStatus.OK)
                .mess("Writing tasks fetched successfully")
                .content(tasks)
                .build());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResponseObject> getWritingTaskById(@PathVariable int id) {
        WritingTask task = writingService.getWritingTaskById(id);
        if (task == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    ResponseObject.builder()
                            .status(HttpStatus.NOT_FOUND)
                            .mess("Writing task not found")
                            .build()
            );
        }
        return ResponseEntity.ok(ResponseObject.builder()
                .status(HttpStatus.OK)
                .mess("Writing task fetched successfully")
                .content(task)
                .build());
    }
}
