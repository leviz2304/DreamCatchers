package com.example.demo.controller.PrivateController;

import com.example.demo.dto.ResponseObject;
import com.example.demo.dto.UserEssayWithFeedbackDTO;
import com.example.demo.entity.data.CommonGrammarIssue;
import com.example.demo.service.ReportService;
import com.fasterxml.jackson.core.JsonProcessingException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/private/report")
@RequiredArgsConstructor
public class MyReportController {
    private final ReportService reportService;

    @PostMapping("/generate-common-issues")
    public ResponseEntity<ResponseObject> generateCommonIssues(@RequestParam Integer userId) throws JsonProcessingException {
        CommonGrammarIssue issue = reportService.generateCommonGrammarIssues(userId);
        return ResponseEntity.ok(
                ResponseObject.builder()
                        .status(HttpStatus.OK)
                        .mess("Common grammar issues generated successfully")
                        .content(issue)
                        .build()
        );
    }
    @GetMapping("/my-report")
    public ResponseEntity<ResponseObject> getMyReport(@RequestParam Integer userId) {
        List<UserEssayWithFeedbackDTO> essays = reportService.getAllUserEssaysWithFeedback(userId);
        return ResponseEntity.ok(
                ResponseObject.builder()
                        .status(HttpStatus.OK)
                        .mess("All essays with feedback retrieved successfully")
                        .content(essays)
                        .build()
        );
    }

    @GetMapping("/common-issues/latest")
    public ResponseEntity<ResponseObject> getLatestCommonIssues(@RequestParam Integer userId) {
        CommonGrammarIssue issue = reportService.getLatestCommonGrammarIssues(userId);
        return ResponseEntity.ok(
                ResponseObject.builder()
                        .status(HttpStatus.OK)
                        .mess("Latest common grammar issues retrieved")
                        .content(issue)
                        .build()
        );
    }
}
