package com.example.demo.controller.PublicController;

import com.example.demo.dto.TestDTO;
import com.example.demo.entity.data.ListeningSection;
import com.example.demo.entity.data.Passage;
import com.example.demo.entity.data.Test;
import com.example.demo.service.TestService;
import com.example.demo.dto.ResponseObject;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/public/tests")
@RequiredArgsConstructor
public class PublicTestController {

    private final TestService testService;

    @GetMapping("")
    public ResponseEntity<ResponseObject> getAllTests() {
        List<Test> tests = testService.getAllTests();
        return ResponseEntity.ok(ResponseObject.builder()
                .status(HttpStatus.OK)
                .mess("Tests fetched successfully")
                .content(tests)
                .build());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResponseObject> getTestById(@PathVariable int id) {
        TestDTO testDTO = testService.getTestDTOById(id);
        if (testDTO == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    ResponseObject.builder()
                            .status(HttpStatus.NOT_FOUND)
                            .mess("Test not found")
                            .build()
            );
        }

        return ResponseEntity.ok(ResponseObject.builder()
                .status(HttpStatus.OK)
                .mess("Test fetched successfully")
                .content(testDTO)
                .build());
    }
}
