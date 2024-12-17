// src/main/java/com/example/demo/service/AIFeedbackService.java

package com.example.demo.service;

import com.example.demo.dto.SpeakingFeedbackDTO;
import com.example.demo.dto.OpenAIRequest;
import com.example.demo.dto.OpenAIResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AIFeedbackService {

    @Value("${openai.api.key}")
    private String openAiApiKey;

    private final RestTemplate restTemplate = new RestTemplate();


    public SpeakingFeedbackDTO generateFeedback(String transcript, String question, String topic) {
        String url = "https://api.openai.com/v1/chat/completions";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(openAiApiKey);

        String prompt = String.format(
                "You are an IELTS examiner. Evaluate the following spoken response for IELTS Speaking Part 1. Provide feedback on pronunciation, grammar, and vocabulary errors. " +
                        "Respond **only** with the JSON format as specified, and **do not include any additional text or formatting**. " +
                        "**Do not include any Markdown formatting or code blocks.**\n\n" +
                        "JSON structure:\n" +
                        "{\n" +
                        "  \"pronunciationErrors\": [\n" +
                        "    {\n" +
                        "      \"word\": \"incorrectWord\",\n" +
                        "      \"error\": \"Pronunciation error description.\",\n" +
                        "      \"recommendation\": \"Correct pronunciation or tip.\"\n" +
                        "    }\n" +
                        "  ],\n" +
                        "  \"grammarErrors\": [\n" +
                        "    {\n" +
                        "      \"sentence\": \"Incorrect sentence here.\",\n" +
                        "      \"error\": \"Grammar error description.\",\n" +
                        "      \"recommendation\": \"Corrected sentence or grammar tip.\"\n" +
                        "    }\n" +
                        "  ],\n" +
                        "  \"vocabularyErrors\": [\n" +
                        "    {\n" +
                        "      \"word\": \"incorrectWord\",\n" +
                        "      \"error\": \"Vocabulary usage error.\",\n" +
                        "      \"recommendation\": \"Suggested word or usage tip.\"\n" +
                        "    }\n" +
                        "  ],\n" +
                        "  \"overallFeedback\": \"General feedback and score.\"\n" +
                        "}\n\n" +
                        "**Question:** %s\n\n" +
                        "**Topic:** %s\n\n" +
                        "**Transcript:**\n%s",
                question, topic, transcript
        );


        // Prepare request payload
        Map<String, Object> payload = new HashMap<>();
        payload.put("model", "gpt-4o-mini");
        List<Map<String, String>> messages = new ArrayList<>();
        Map<String, String> systemMessage = new HashMap<>();
        systemMessage.put("role", "system");
        systemMessage.put("content", "You are a helpful assistant.");
        Map<String, String> userMessage = new HashMap<>();
        userMessage.put("role", "user");
        userMessage.put("content", prompt);
        messages.add(systemMessage);
        messages.add(userMessage);
        payload.put("messages", messages);

        HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(payload, headers);

        ResponseEntity<String> response = restTemplate.postForEntity(url, requestEntity, String.class);

        if (response.getStatusCode() == HttpStatus.OK) {
            // Parse the AI's JSON response
            ObjectMapper mapper = new ObjectMapper();
            try {
                String aiResponse = mapper.readTree(response.getBody())
                        .path("choices")
                        .get(0)
                        .path("message")
                        .path("content")
                        .asText();
                aiResponse = cleanAIResponse(aiResponse);

                // Convert the response to SpeakingFeedbackDTO
                return SpeakingFeedbackDTO.fromJson(aiResponse);
            } catch (IOException e) {
                throw new RuntimeException("Failed to parse AI feedback response.", e);
            }
        } else {
            throw new RuntimeException("Failed to get feedback from AI. Status: " + response.getStatusCode());
        }
    }

    private String cleanAIResponse(String aiResponse) {
        // Loại bỏ các ký tự không mong muốn
        aiResponse = aiResponse.trim();

        // Kiểm tra và loại bỏ phần mở đầu của code block
        if (aiResponse.startsWith("```json")) {
            aiResponse = aiResponse.substring(aiResponse.indexOf("```json") + 7).trim();
            // Loại bỏ phần kết thúc của code block
            if (aiResponse.endsWith("```")) {
                aiResponse = aiResponse.substring(0, aiResponse.lastIndexOf("```")).trim();
            }
        } else if (aiResponse.startsWith("```")) {
            aiResponse = aiResponse.substring(aiResponse.indexOf("```") + 3).trim();
            // Loại bỏ phần kết thúc của code block
            if (aiResponse.endsWith("```")) {
                aiResponse = aiResponse.substring(0, aiResponse.lastIndexOf("```")).trim();
            }
        }

        // Kiểm tra và loại bỏ bất kỳ ký tự không phải JSON nào ở đầu và cuối
        int startIndex = aiResponse.indexOf("{");
        int endIndex = aiResponse.lastIndexOf("}");
        if (startIndex != -1 && endIndex != -1) {
            aiResponse = aiResponse.substring(startIndex, endIndex + 1);
        }

        return aiResponse;
    }

    public String getAnswerSuggestions(String prompt) {
        String url = "https://api.openai.com/v1/chat/completions";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(openAiApiKey);

        // Prepare request payload
        Map<String, Object> payload = new HashMap<>();
        payload.put("model", "gpt-4o-mini");
        List<Map<String, String>> messages = new ArrayList<>();
        Map<String, String> systemMessage = new HashMap<>();
        systemMessage.put("role", "system");
        systemMessage.put("content", "You are a helpful assistant.");
        Map<String, String> userMessage = new HashMap<>();
        userMessage.put("role", "user");
        userMessage.put("content", prompt);
        messages.add(systemMessage);
        messages.add(userMessage);
        payload.put("messages", messages);

        HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(payload, headers);

        ResponseEntity<String> response = restTemplate.postForEntity(url, requestEntity, String.class);

        if (response.getStatusCode() == HttpStatus.OK) {
            // Parse the AI's JSON response
            ObjectMapper mapper = new ObjectMapper();
            try {
                String aiResponse = mapper.readTree(response.getBody())
                        .path("choices")
                        .get(0)
                        .path("message")
                        .path("content")
                        .asText();

                return aiResponse;
            } catch (IOException e) {
                throw new RuntimeException("Failed to parse AI answer suggestions response.", e);
            }
        } else {
            throw new RuntimeException("Failed to get answer suggestions from AI. Status: " + response.getStatusCode());
        }
    }
}
