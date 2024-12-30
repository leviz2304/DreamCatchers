package com.example.demo.service;

import com.example.demo.entity.data.Vocabulary;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;
import org.json.JSONObject;
import org.json.JSONArray;

import java.util.ArrayList;
import java.util.List;

@Service
public class GPTService {

    @Value("${openai.api.key}")
    private String openAIApiKey;

    private final String OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

    private final ObjectMapper objectMapper = new ObjectMapper();

    public List<Vocabulary> generateVocabulary(String topic, int quantity, String level) {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(openAIApiKey);

        JSONObject requestBody = new JSONObject();
        requestBody.put("model", "gpt-4o-mini");
        JSONArray messages = new JSONArray();

        JSONObject systemMessage = new JSONObject();
        systemMessage.put("role", "system");
        systemMessage.put("content", "You are a JSON-producing assistant. Respond ONLY with a JSON array of vocabulary items. " +
                "Each item is a JSON object: {\"word\":\"...\", \"definition\":\"...\", \"example\":\"...\"}. " +
                "No additional text, no explanation, no code fences outside the JSON. If unsure, return [].");
        JSONObject userMessage = new JSONObject();
        userMessage.put("role", "user");
        userMessage.put("content", String.format(
                "Generate a JSON array of %d vocabulary items about topic '%s' at '%s' level. " +
                        "Each item must have: \"word\", \"definition\", \"example\" keys. " +
                        "Do not include any text outside of the JSON array. " +
                        "If you cannot produce the result, just return an empty JSON array [].",
                quantity, topic, level));

        messages.put(systemMessage);
        messages.put(userMessage);
        requestBody.put("messages", messages);

        HttpEntity<String> entity = new HttpEntity<>(requestBody.toString(), headers);

        try {
            ResponseEntity<String> response = restTemplate.postForEntity(OPENAI_API_URL, entity, String.class);
            if (response.getStatusCode() == HttpStatus.OK) {
                JSONObject responseBody = new JSONObject(response.getBody());
                JSONArray choices = responseBody.getJSONArray("choices");
                String content = choices.getJSONObject(0).getJSONObject("message").getString("content");

                // Loại bỏ code fences nếu có
                content = stripCodeFences(content).trim();

                // Parse JSON array
                return parseVocabularyJSON(content);
            } else {
                throw new RuntimeException("GPT API request failed with status: " + response.getStatusCode());
            }
        } catch (Exception e) {
            throw new RuntimeException("Error while calling GPT API: " + e.getMessage(), e);
        }
    }

    private List<Vocabulary> parseVocabularyJSON(String jsonArrayStr) {
        try {
            if (jsonArrayStr.isEmpty()) {
                return new ArrayList<>();
            }
            // Kiểm tra nếu jsonArrayStr bắt đầu bằng [ và kết thúc bằng ]
            if (!jsonArrayStr.trim().startsWith("[") || !jsonArrayStr.trim().endsWith("]")) {
                throw new RuntimeException("Invalid JSON array format from GPT.");
            }

            // Parse JSON Array trực tiếp sang List<Vocabulary>
            List<Vocabulary> vocabList = objectMapper.readValue(jsonArrayStr, new TypeReference<List<Vocabulary>>(){});
            return vocabList;
        } catch (Exception e) {
            // Nếu lỗi parse, bạn có thể retry hoặc trả về empty list
            System.err.println("Error parsing vocabulary JSON: " + e.getMessage());
            throw new RuntimeException("Failed to parse GPT JSON response.");
        }
    }

    private String stripCodeFences(String content) {
        // Xóa ```json ở đầu và ``` ở cuối nếu có
        if (content.startsWith("```")) {
            // Tìm dòng xuống hàng đầu tiên
            int firstNewline = content.indexOf("\n");
            if (firstNewline != -1) {
                content = content.substring(firstNewline + 1);
            }
            // Xóa 3 backticks cuối
            if (content.endsWith("```")) {
                content = content.substring(0, content.length() - 3);
            }
        }
        return content;
    }
}
