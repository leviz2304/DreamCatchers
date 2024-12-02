package com.example.demo.service;

import com.example.demo.entity.data.Vocabulary;
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

    public List<Vocabulary> generateVocabulary(String topic, int quantity, String level) {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(openAIApiKey);

        JSONObject requestBody = new JSONObject();
        requestBody.put("model", "gpt-4"); // hoặc mô hình bạn muốn sử dụng
        JSONArray messages = new JSONArray();
        JSONObject systemMessage = new JSONObject();
        systemMessage.put("role", "system");
        systemMessage.put("content", "Bạn là một trợ lý giúp tạo danh sách từ vựng.");
        JSONObject userMessage = new JSONObject();
        userMessage.put("role", "user");
        userMessage.put("content", String.format(
                "Hãy tạo một danh sách gồm %d từ vựng về chủ đề '%s' ở mức độ '%s'. Đối với mỗi từ, hãy cung cấp định nghĩa và một ví dụ sử dụng.",
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

                // Phân tích nội dung trả về để trích xuất từ vựng
                return parseVocabularyFromGPTResponse(content);
            } else {
                throw new RuntimeException("GPT API request failed with status: " + response.getStatusCode());
            }
        } catch (Exception e) {
            throw new RuntimeException("Error while calling GPT API: " + e.getMessage());
        }
    }

    private List<Vocabulary> parseVocabularyFromGPTResponse(String response) {
        List<Vocabulary> vocabularies = new ArrayList<>();
        // Giả sử GPT trả về danh sách dưới dạng:
        // 1. Word1: Definition1. Example1.
        // 2. Word2: Definition2. Example2.
        String[] lines = response.split("\n");
        for (String line : lines) {
            line = line.trim();
            if (line.matches("^\\d+\\.\\s+.*")) { // Kiểm tra dòng bắt đầu bằng số.
                // Tách số thứ tự
                int dotIndex = line.indexOf('.');
                String content = line.substring(dotIndex + 1).trim();
                // Tách từ, định nghĩa và ví dụ
                String[] parts = content.split(":");
                if (parts.length >= 2) {
                    String word = parts[0].trim();
                    String[] defAndEx = parts[1].split("\\. ");
                    String definition = defAndEx[0].trim();
                    String example = defAndEx.length > 1 ? defAndEx[1].trim() : "";
                    Vocabulary vocab = Vocabulary.builder()
                            .word(word)
                            .definition(definition)
                            .example(example)
                            .build();
                    vocabularies.add(vocab);
                }
            }
        }
        return vocabularies;
    }
}
