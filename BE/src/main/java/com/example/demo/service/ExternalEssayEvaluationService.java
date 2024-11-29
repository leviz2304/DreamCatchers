package com.example.demo.service;

import com.example.demo.dto.EssayFeedback;
import com.example.demo.dto.OpenAIRequest;
import com.example.demo.dto.OpenAIResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class ExternalEssayEvaluationService {

    @Value("${openai.api.key}")
    private String apiKey;

    @Value("${openai.api.url}")
    private String apiUrl;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    private static final long COOLDOWN_PERIOD = 3000; // 3 seconds
    private long lastRequestTime = 0;

    public EssayFeedback evaluateEssay(String prompt, String essayContent) {
        // Kiểm tra cooldown nếu cần thiết
        long currentTime = System.currentTimeMillis();
        if (currentTime - lastRequestTime < COOLDOWN_PERIOD) {
            try {
                Thread.sleep(COOLDOWN_PERIOD - (currentTime - lastRequestTime));
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }
        lastRequestTime = System.currentTimeMillis();

        // Tạo đối tượng OpenAIRequest
        OpenAIRequest requestPayload = new OpenAIRequest();
        requestPayload.setModel("gpt-4o-mini");
        requestPayload.setMessages(Arrays.asList(
                new OpenAIRequest.Message("system", "You are an IELTS examiner."),
                new OpenAIRequest.Message("user", buildUserMessage(prompt, essayContent))
        ));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);

        HttpEntity<OpenAIRequest> entity = new HttpEntity<>(requestPayload, headers);

        try {
            ResponseEntity<String> response = restTemplate.postForEntity(apiUrl, entity, String.class);

            if (response.getStatusCode() == HttpStatus.OK) {
                // Ghi log phản hồi từ AI để kiểm tra
                System.out.println("AI Response Body: " + response.getBody());

                OpenAIResponse openAIResponse = objectMapper.readValue(response.getBody(), OpenAIResponse.class);
                if (openAIResponse.getChoices() != null && !openAIResponse.getChoices().isEmpty()) {
                    String content = openAIResponse.getChoices().get(0).getMessage().getContent();
                    // Ghi log nội dung phần content
                    System.out.println("AI Content for Deserialization: " + content);

                    // Deserialize chỉ phần content vào EssayFeedback
                    return objectMapper.readValue(content, EssayFeedback.class);
                } else {
                    throw new RuntimeException("No choices found in AI response.");
                }
            } else {
                throw new RuntimeException("Failed to get response from AI. Status code: " + response.getStatusCode());
            }
        } catch (HttpClientErrorException.BadRequest e) {
            // Ghi log lỗi chi tiết từ OpenAI
            System.err.println("Bad Request Error: " + e.getResponseBodyAsString());
            throw new RuntimeException("Bad Request: " + e.getResponseBodyAsString(), e);
        } catch (Exception e) {
            throw new RuntimeException("Error processing AI response: " + e.getMessage(), e);
        }
    }

    private String buildUserMessage(String prompt, String essayContent) {
        return "Please evaluate the following essay focusing on grammatical and vocabulary errors. Provide the feedback strictly in JSON format with the following structure:\n" +
                "{\n" +
                "  \"grammarErrors\": [\n" +
                "    {\n" +
                "      \"sentence\": \"Incorrect sentence here.\",\n" +
                "      \"error\": \"Subject-verb agreement.\",\n" +
                "      \"recommendation\": \"Corrected sentence here.\"\n" +
                "    }\n" +
                "  ],\n" +
                "  \"vocabularyErrors\": [\n" +
                "    {\n" +
                "      \"word\": \"incorrectWord\",\n" +
                "      \"error\": \"Wrong usage.\",\n" +
                "      \"recommendation\": \"Suggested word here.\"\n" +
                "    }\n" +
                "  ],\n" +
                "  \"overallFeedback\": \"Detailed overall feedback here.\",\n" +
                "  \"overallScore\": 6\n" +
                "}\n\n" +
                "**Prompt:**\n" + prompt + "\n\n" +
                "**Essay:**\n" + essayContent;
    }

    public double calculateScore(String feedback) {
        // Sử dụng regex để tìm điểm số từ 0 đến 9, có thể có dấu chấm thập phân
        Pattern pattern = Pattern.compile("(\\b[0-9](?:\\.[0-9])?\\b)");
        Matcher matcher = pattern.matcher(feedback);
        double score = 0.0;
        while (matcher.find()) {
            double potentialScore = Double.parseDouble(matcher.group());
            if (potentialScore >= 0.0 && potentialScore <= 9.0) {
                score = potentialScore;
                break;
            }
        }
        return score;
    }
}
