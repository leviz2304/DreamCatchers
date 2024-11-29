package com.example.demo.controller.PrivateController;

import com.example.demo.dto.ResponseObject;
import com.example.demo.dto.UserResponseDTO;
import com.example.demo.entity.data.TestProgress;
import com.example.demo.service.TestService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/private/tests")
@RequiredArgsConstructor
public class PrivateTestController {

    private final TestService testService;

    @PostMapping("/{testId}/start")
    public ResponseEntity<ResponseObject> startTest(@PathVariable int testId, @RequestParam int userId) {
        TestProgress testProgress = testService.startTest(testId, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(
                ResponseObject.builder()
                        .status(HttpStatus.CREATED)
                        .mess("Test started")
                        .content(testProgress)
                        .build()
        );
    }

    @PostMapping("/{testProgressId}/submit-responses")
    public ResponseEntity<ResponseObject> submitResponses(
            @PathVariable int testProgressId,
            @RequestBody List<UserResponseDTO> userResponses) {

        testService.submitUserResponses(testProgressId, userResponses);

        return ResponseEntity.ok(
                ResponseObject.builder()
                        .status(HttpStatus.OK)
                        .mess("Responses submitted")
                        .build()
        );
    }


    @PostMapping("/{testProgressId}/complete")
    public ResponseEntity<ResponseObject> completeTest(@PathVariable int testProgressId) {
        testService.completeTest(testProgressId);
        return ResponseEntity.ok(
                ResponseObject.builder()
                        .status(HttpStatus.OK)
                        .mess("Test completed")
                        .build()
        );
    }
}
