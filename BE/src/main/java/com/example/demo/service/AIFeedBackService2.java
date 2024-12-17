// src/main/java/com/example/demo/service/AIFeedbackService.java

package com.example.demo.service;

import com.example.demo.dto.AIChatRequestDTO;
import com.example.demo.dto.OpenAIRequest;
import com.example.demo.dto.OpenAIResponse;
import com.example.demo.entity.data.SpeakingQuestion;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.repository.data.SpeakingQuestionRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;

@Service
@RequiredArgsConstructor
public class AIFeedBackService2 {

    @Value("${openai.api.key}")
    private String openAiApiKey;

    @Value("${openai.model.chat}")
    private String chatModel; // e.g., "gpt-4o-mini"

    @Value("${openai.api.url}")
    private String apiUrl;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final SpeakingQuestionRepository speakingQuestionRepository;

    // Sinh câu trả lời dựa trên ý tưởng của người dùng
    public String generateAnswer(AIChatRequestDTO chatRequest) {
        SpeakingQuestion question = speakingQuestionRepository.findById(chatRequest.getQuestionId())
                .orElseThrow(() -> new ResourceNotFoundException("SpeakingQuestion", "id", chatRequest.getQuestionId()));

        String prompt = String.format(
                "Bạn là một chuyên gia dạy IELTS. Dựa trên ý tưởng của người dùng, hãy viết một câu trả lời hoàn chỉnh cho câu hỏi dưới đây trong khoảng 2 đến 3 câu vì đây là IELTS Speaking Part 1. Chỉ trả về một câu trả lời duy nhất và bằng tiếng anh.\n\n" +
                        "**Câu Hỏi:** %s\n\n" +
                        "**Ý Tưởng Người Dùng:** %s\n\n" +
                        "Câu trả lời của bạn:",
                question.getQuestionText(),
                chatRequest.getUserInput()
        );

        // Tạo yêu cầu đến OpenAI API
        OpenAIRequest requestPayload = new OpenAIRequest();
        requestPayload.setModel(chatModel);
        requestPayload.setMessages(Arrays.asList(
                new OpenAIRequest.Message("user", prompt,null)
        ));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(openAiApiKey);

        HttpEntity<OpenAIRequest> requestEntity = new HttpEntity<>(requestPayload, headers);

        try {
            ResponseEntity<String> response = restTemplate.exchange(
                    apiUrl,
                    HttpMethod.POST,
                    requestEntity,
                    String.class
            );

            if (response.getStatusCode() == HttpStatus.OK) {
                String responseBody = response.getBody();

                // Lấy nội dung trả về từ AI
                JsonNode rootNode = objectMapper.readTree(responseBody);
                String aiContent = rootNode.path("choices").get(0).path("message").path("content").asText();

                return aiContent.trim();
            } else {
                throw new RuntimeException("Failed to get response from AI. Status code: " + response.getStatusCode());
            }
        } catch (Exception e) {
            throw new RuntimeException("Error processing AI response: " + e.getMessage(), e);
        }
    }
}
