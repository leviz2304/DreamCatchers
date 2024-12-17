package com.example.demo.service;

import com.example.demo.dto.EssayFeedback;
import com.example.demo.dto.UserEssayWithFeedbackDTO;
import com.example.demo.entity.data.CommonGrammarIssue;
import com.example.demo.entity.data.UserEssay;
import com.example.demo.entity.user.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.repository.data.CommonGrammarIssueRepository;
import com.example.demo.repository.data.UserEssayRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReportService {
    private final UserEssayRepository userEssayRepository;
    private final ExternalEssayEvaluationService externalEssayEvaluationService;
    private final CommonGrammarIssueRepository commonGrammarIssueRepository;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public List<UserEssay> getLastFiveEssays(Integer userId) {
        // Giả sử đã có method findTop5ByUserIdOrderBySubmissionTimeDesc
        // Nếu chưa có thì tạo query:
        return userEssayRepository.findTop5ByUserIdOrderBySubmissionTimeDesc(userId);
    }

    public CommonGrammarIssue generateCommonGrammarIssues(Integer userId) throws JsonProcessingException {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<UserEssay> lastFiveEssays = getLastFiveEssays(userId);
        if (lastFiveEssays.isEmpty()) {
            throw new RuntimeException("No essays found for this user");
        }

        // Ghép nội dung 5 bài viết
        StringBuilder essaysContent = new StringBuilder();
        for (int i = 0; i < lastFiveEssays.size(); i++) {
            essaysContent.append("Essay ").append(i+1).append(": ").append(lastFiveEssays.get(i).getContent()).append("\n\n");
        }

        // Gửi nội dung lên GPT-4o-mini để lấy 3 lỗi ngữ pháp thường gặp
        // Prompt ví dụ:
        String prompt = "Below are 5 essays written by the same user. Identify the top 3 most frequent grammar errors they make, provide a brief explanation and a corrected example. Respond in strict JSON format:\n" +
                "{\n" +
                "  \"issues\": [\n" +
                "    {\n" +
                "      \"error\": \"Name of error\",\n" +
                "      \"example\": \"Incorrect example from user's essays\",\n" +
                "      \"recommendation\": \"Corrected version\"\n" +
                "    }\n" +
                "  ]\n" +
                "}\n\n" +
                "Essays:\n" + essaysContent.toString() +
                "Respond ONLY with the JSON object.";


        String commonIssuesJson = externalEssayEvaluationService.evaluateCommonIssues(prompt);

        CommonGrammarIssue issueRecord = CommonGrammarIssue.builder()
                .user(user)
                .commonErrorsJson(commonIssuesJson)
                .createdAt(LocalDateTime.now())
                .build();

        return commonGrammarIssueRepository.save(issueRecord);
    }
    public List<UserEssayWithFeedbackDTO> getAllUserEssaysWithFeedback(Integer userId) {
        List<UserEssay> essays = userEssayRepository.findUserEssaysByUserId(userId);
        ObjectMapper mapper = new ObjectMapper();
        List<UserEssayWithFeedbackDTO> result = new ArrayList<>();

        for (UserEssay essay : essays) {
            EssayFeedback feedback = null;
            if (essay.getFeedbackJson() != null && !essay.getFeedbackJson().trim().isEmpty()) {
                try {
                    feedback = mapper.readValue(essay.getFeedbackJson(), EssayFeedback.class);
                } catch (JsonProcessingException e) {
                    // Có thể ghi log, bỏ qua feedback nếu parse lỗi
                    System.err.println("Error parsing feedback JSON for essay " + essay.getId() + ": " + e.getMessage());
                }
            }

            UserEssayWithFeedbackDTO dto = new UserEssayWithFeedbackDTO(
                    essay.getId(),
                    essay.getContent(),
                    essay.getSubmissionTime(),
                    essay.getScore(),
                    feedback // có thể null nếu không parse được
            );

            result.add(dto);
        }

        return result;
    }

    public CommonGrammarIssue getLatestCommonGrammarIssues(Integer userId) {
        return commonGrammarIssueRepository.findTopByUserIdOrderByCreatedAtDesc(userId);
    }
}
