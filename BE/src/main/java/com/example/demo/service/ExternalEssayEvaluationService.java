package com.example.demo.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class ExternalEssayEvaluationService {

    @Value("${openai.api.key}")
    private String apiKey;

    @Value("${openai.api.url}")
    private String apiUrl;

    private static final long COOLDOWN_PERIOD = 3000; // 3 seconds
    private long lastRequestTime = 0;

    public String evaluateEssay(String prompt, String essayContent) {
        System.out.println(prompt);
        long currentTime = System.currentTimeMillis();
        if (currentTime - lastRequestTime < COOLDOWN_PERIOD) {
            throw new RuntimeException("Too many requests. Please try again later.");
        }
        lastRequestTime = currentTime;

        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", "Bearer " + apiKey);

        Map<String, Object> body = new HashMap<>();
        body.put("model", "gpt-4o-mini");
        body.put("messages", List.of(
                Map.of("role", "system", "content", "You are an IELTS examiner. Evaluate essays based on IELTS criteria (Task Response, Coherence and Cohesion, Lexical Resource, Grammatical Range and Accuracy). Provide a score between 0 and 9, and explain the reasoning for each criterion."),
                Map.of("role", "user", "content",
                        "Please evaluate the following essay based on the IELTS criteria (Task Response, Coherence and Cohesion, Lexical Resource, Grammatical Range and Accuracy). " +
                                "Provide the feedback in JSON format with each criterion having a score and detailed comments.\n\n" +
                                "**Prompt:**\n" + prompt + "\n\n" +
                                "**Essay:**\n" + essayContent)
                ));

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(apiUrl, request, Map.class);
            Map<String, Object> choices = (Map<String, Object>) ((List<?>) response.getBody().get("choices")).get(0);
            return (String) ((Map<String, Object>) choices.get("message")).get("content");
        } catch (HttpClientErrorException.TooManyRequests e) {
            throw new RuntimeException("API quota exceeded. Please check your OpenAI account.");
        }
    }

    public double calculateScore(String feedback) {
        // Use regex to find a score between 0 and 9, possibly with a decimal point
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

