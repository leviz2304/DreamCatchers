package com.example.demo.service;

import com.google.api.gax.core.FixedCredentialsProvider;
import com.google.auth.oauth2.ServiceAccountCredentials;
import com.google.cloud.speech.v1.*;
import com.google.protobuf.ByteString;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.InputStream;

@Slf4j
@Service
public class SpeechToTextService {

    private final SpeechClient speechClient;

    public SpeechToTextService() {
        try {
            // Tải tệp JSON từ thư mục resources
            ClassPathResource resource = new ClassPathResource("google-speech-key.json"); // Đảm bảo tệp này nằm trong src/main/resources

            // Tạo thông tin xác thực từ tệp JSON
            InputStream credentialsStream = resource.getInputStream();
            ServiceAccountCredentials credentials = ServiceAccountCredentials.fromStream(credentialsStream);

            // Tạo SpeechClient với thông tin xác thực
            SpeechSettings speechSettings = SpeechSettings.newBuilder()
                    .setCredentialsProvider(FixedCredentialsProvider.create(credentials))
                    .build();

            speechClient = SpeechClient.create(speechSettings);

            log.info("SpeechClient initialized with provided credentials.");
        } catch (IOException e) {
            log.error("Không thể khởi tạo SpeechClient với thông tin xác thực", e);
            throw new RuntimeException("Failed to initialize SpeechClient", e);
        }
    }

    public String transcribeAudio(byte[] audioBytes) {
        try {
            // Configure recognition settings
            RecognitionConfig config = RecognitionConfig.newBuilder()
                    .setEncoding(RecognitionConfig.AudioEncoding.WEBM_OPUS) // Set to WEBM_OPUS
                    .setLanguageCode("en-US") // Adjust as needed
                    .build(); // Do not set sampleRateHertz

            // Create the audio content
            RecognitionAudio audio = RecognitionAudio.newBuilder()
                    .setContent(ByteString.copyFrom(audioBytes))
                    .build();

            // Perform the transcription
            RecognizeResponse response = speechClient.recognize(config, audio);

            // Process the results
            StringBuilder transcription = new StringBuilder();
            for (SpeechRecognitionResult result : response.getResultsList()) {
                transcription.append(result.getAlternativesList().get(0).getTranscript());
            }

            log.info("Transcription successful: {}", transcription.toString());

            return transcription.toString();
        } catch (Exception e) {
            log.error("Failed to transcribe audio.", e);
            throw new RuntimeException("Failed to transcribe audio.", e);
        }
    }

    // Ensure SpeechClient is closed when the application stops
    public void shutdown() {
        if (speechClient != null) {
            speechClient.close();
        }
    }
}
