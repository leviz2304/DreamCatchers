package com.example.demo.service;

import com.example.demo.dto.*;
import com.example.demo.entity.data.PronunciationAssessment;
import com.example.demo.entity.data.Sentence;
import com.example.demo.entity.data.Topic;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.repository.data.PronunciationAssessmentRepository;
import com.example.demo.repository.data.SentenceRepository;
import com.example.demo.repository.data.TopicRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.microsoft.cognitiveservices.speech.*;
import com.microsoft.cognitiveservices.speech.audio.AudioConfig;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import java.nio.file.Files;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
public class PronunciationService {

    @Autowired
    private SentenceRepository sentenceRepository;

    @Autowired
    private PronunciationAssessmentRepository assessmentRepository;

    @Autowired
    private TopicRepository topicRepository;

    @Value("${azure.speech.key}")
    private String subscriptionKey;

    @Value("${azure.speech.region}")
    private String region;
    @Autowired
    private MediaStorageService mediaStorageService;
    /**
     * Đánh giá phát âm của người dùng cho một câu cụ thể.
     */
    public List<TopicDTO> getAllTopics() {
        List<Topic> topics = topicRepository.findAll();
        return topics.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    public List<SentenceDTO> getSentencesByTopic(Integer topicId) {
        List<Sentence> sentences = sentenceRepository.findByTopicId(topicId);
        return sentences.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    /**
     * Chuyển đổi tệp âm thanh sang định dạng WAV hợp lệ sử dụng FFmpeg
     */
    private File convertToWav(File inputFile) throws IOException, InterruptedException {
        File outputFile = File.createTempFile("converted_audio", ".wav");

        // Xây dựng lệnh FFmpeg
        ProcessBuilder pb = new ProcessBuilder(
                "ffmpeg",
                "-i", inputFile.getAbsolutePath(),
                "-ar", "16000",        // Sample rate: 16kHz
                "-ac", "1",            // Channels: Mono
                "-sample_fmt", "s16",  // Bit depth: 16-bit
                outputFile.getAbsolutePath()
        );

        pb.redirectErrorStream(true); // Kết hợp stderr và stdout

        Process process = pb.start();

        // Đọc và log output từ FFmpeg
        BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
        String line;
        while ((line = reader.readLine()) != null) {
            log.info("FFmpeg: {}", line);
        }

        int exitCode = process.waitFor();
        if (exitCode != 0) {
            log.error("FFmpeg conversion failed with exit code {}", exitCode);
            throw new RuntimeException("FFmpeg conversion failed.");
        }

        return outputFile;
    }

    /**
     * Kiểm tra xem tệp WAV có hợp lệ không
     */
    private boolean isValidWavFile(File file) {
        try (FileInputStream fis = new FileInputStream(file)) {
            byte[] header = new byte[44];
            if (fis.read(header) != 44) {
                return false;
            }

            String riff = new String(header, 0, 4);
            String wave = new String(header, 8, 4);

            if (!riff.equals("RIFF") || !wave.equals("WAVE")) {
                return false;
            }

            short audioFormat = ByteBuffer.wrap(header, 20, 2).order(ByteOrder.LITTLE_ENDIAN).getShort();
            short bitsPerSample = ByteBuffer.wrap(header, 34, 2).order(ByteOrder.LITTLE_ENDIAN).getShort();
            short numChannels = ByteBuffer.wrap(header, 22, 2).order(ByteOrder.LITTLE_ENDIAN).getShort();
            int sampleRate = ByteBuffer.wrap(header, 24, 4).order(ByteOrder.LITTLE_ENDIAN).getInt();

            return audioFormat == 1 && bitsPerSample == 16 && numChannels == 1 && sampleRate == 16000;
        } catch (IOException e) {
            log.error("Failed to validate WAV file: {}", e.getMessage(), e);
            return false;
        }
    }

    public PronunciationResultDTO assessPronunciation(Integer userId, Integer sentenceId, MultipartFile audioFile) {
        File tempFile = null;

        try {
            Sentence sentence = sentenceRepository.findById(sentenceId)
                    .orElseThrow(() -> new ResourceNotFoundException("Sentence not found with ID: " + sentenceId));

            tempFile = File.createTempFile("audio", ".wav");
            audioFile.transferTo(tempFile);

            if (!isValidWavFile(tempFile)) {
                throw new RuntimeException("Audio file is not in valid WAV format.");
            }

            try (SpeechConfig speechConfig = SpeechConfig.fromSubscription(subscriptionKey, region);
                 AudioConfig audioConfig = AudioConfig.fromWavFileInput(tempFile.getAbsolutePath());
                 SpeechRecognizer recognizer = new SpeechRecognizer(speechConfig, audioConfig)) {

                // Normalize text: Remove punctuation and convert to lowercase
                String normalizedText = sentence.getText().replaceAll("[^a-zA-Z0-9 ]", "").toLowerCase();

                // Create the pronunciation configuration
                PronunciationAssessmentConfig pronunciationConfig = new PronunciationAssessmentConfig(
                        normalizedText,
                        PronunciationAssessmentGradingSystem.HundredMark,
                        PronunciationAssessmentGranularity.Phoneme
                );

                // Enable miscue detection using recognizer properties
                recognizer.getProperties().setProperty("PronunciationAssessment.EnableMiscue", "true");

                // Apply configuration to the recognizer
                pronunciationConfig.applyTo(recognizer);

                SpeechRecognitionResult recognitionResult = recognizer.recognizeOnceAsync().get();

                if (!recognitionResult.getReason().toString().equals("RecognizedSpeech")) {
                    log.error("Recognition failed: Reason = {}, JSON = {}",
                            recognitionResult.getReason(),
                            recognitionResult.getProperties().getProperty(PropertyId.SpeechServiceResponse_JsonResult));
                    throw new RuntimeException("Speech recognition failed: " + recognitionResult.getReason());
                }

                String jsonResponse = recognitionResult.getProperties().getProperty(PropertyId.SpeechServiceResponse_JsonResult);
                log.info("JSON Response: {}", jsonResponse);

                ObjectMapper objectMapper = new ObjectMapper();
                JsonNode rootNode = objectMapper.readTree(jsonResponse);
                JsonNode nBestNode = rootNode.path("NBest").get(0);
                JsonNode pronunciationNode = nBestNode.path("PronunciationAssessment");

                double accuracyScore = pronunciationNode.path("AccuracyScore").asDouble();
                double fluencyScore = pronunciationNode.path("FluencyScore").asDouble();
                double completenessScore = pronunciationNode.path("CompletenessScore").asDouble();
                double pronScore = pronunciationNode.path("PronScore").asDouble();

                // Extract mispronounced words
                List<String> mispronouncedWords = new ArrayList<>();
                JsonNode wordsNode = nBestNode.path("Words");
                if (wordsNode.isArray()) {
                    for (JsonNode wordNode : wordsNode) {
                        double wordAccuracy = wordNode.path("PronunciationAssessment").path("AccuracyScore").asDouble();
                        String word = wordNode.path("Word").asText().toLowerCase();
                        if (wordAccuracy < 80.0) { // Threshold for mispronunciation
                            mispronouncedWords.add(word);
                        }
                    }
                }

                PronunciationResultDTO resultDTO = PronunciationResultDTO.builder()
                        .sentenceId(sentence.getId())
                        .accuracyScore(accuracyScore)
                        .fluencyScore(fluencyScore)
                        .completenessScore(completenessScore)
                        .overallPronunciationScore(pronScore)
                        .feedback(jsonResponse)
                        .mispronouncedWords(mispronouncedWords)
                        .build();

                PronunciationAssessment assessment = new PronunciationAssessment();
                assessment.setUserId(userId);
                assessment.setSentenceId(sentence.getId());
                assessment.setScore(pronScore);
                assessment.setAssessedAt(LocalDateTime.now());
                assessmentRepository.save(assessment);

                return resultDTO;
            }

        } catch (Exception e) {
            log.error("Error while assessing pronunciation: {}", e.getMessage(), e);
            throw new RuntimeException("Error during pronunciation assessment.");
        } finally {
            if (tempFile != null && tempFile.exists()) {
                try {
                    Files.deleteIfExists(tempFile.toPath());
                } catch (IOException e) {
                    log.error("Failed to delete temp file: {}", tempFile.getAbsolutePath(), e);
                }
            }
        }
    }



    // Tạo topic
    public TopicDTO createTopic(TopicDTO topicDTO) {
        Topic topic = new Topic();
        topic.setName(topicDTO.getName());
        Topic savedTopic = topicRepository.save(topic);
        return convertToDTO(savedTopic);
    }

    // Lấy tất cả các topic
    // (Có thể thêm phương thức này nếu chưa có)

    // Lấy chi tiết 1 topic
    public TopicDTO getTopicById(Integer topicId) {
        Topic topic = topicRepository.findById(topicId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy Topic với ID " + topicId));
        return convertToDTO(topic);
    }

    // Cập nhật topic
    public TopicDTO updateTopic(Integer topicId, TopicDTO topicDTO) {
        Topic topic = topicRepository.findById(topicId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy Topic với ID " + topicId));

        topic.setName(topicDTO.getName());
        Topic updatedTopic = topicRepository.save(topic);
        return convertToDTO(updatedTopic);
    }

    // Xóa topic
    public void deleteTopic(Integer topicId) {
        Topic topic = topicRepository.findById(topicId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy Topic với ID " + topicId));
        topicRepository.delete(topic);
    }

    public SentenceDTO uploadAudioForSentence(Integer sentenceId, MultipartFile audioFile) {
        Sentence sentence = sentenceRepository.findById(sentenceId)
                .orElseThrow(() -> new ResourceNotFoundException("Sentence not found with ID: " + sentenceId));

        // Upload the audio file to storage
        MediaResponseDTO mediaResponse = mediaStorageService.uploadFile(audioFile, "sentences");

        // Update the sentence's audio URL
        sentence.setAudioUrl(mediaResponse.getUrl());
        Sentence updatedSentence = sentenceRepository.save(sentence);

        return convertToDTO(updatedSentence);
    }
    public SentenceDTO createSentence(SentenceDTO sentenceDTO) {
        Topic topic = topicRepository.findById(sentenceDTO.getTopicId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy Topic với ID " + sentenceDTO.getTopicId()));

        Sentence sentence = new Sentence();
        sentence.setText(sentenceDTO.getText());
        sentence.setTopic(topic);
        Sentence savedSentence = sentenceRepository.save(sentence);
        return convertToDTO(savedSentence);
    }

    // Lấy chi tiết một Sentence theo ID
    public SentenceDTO getSentenceById(Integer sentenceId) {
        Sentence sentence = sentenceRepository.findById(sentenceId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy Sentence với ID " + sentenceId));
        return convertToDTO(sentence);
    }

    // Cập nhật Sentence theo ID
    public SentenceDTO updateSentence(Integer sentenceId, SentenceDTO sentenceDTO) {
        Sentence sentence = sentenceRepository.findById(sentenceId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy Sentence với ID " + sentenceId));

        sentence.setText(sentenceDTO.getText());
        Sentence updatedSentence = sentenceRepository.save(sentence);
        return convertToDTO(updatedSentence);
    }

    // Xóa Sentence theo ID
    public void deleteSentence(Integer sentenceId) {
        Sentence sentence = sentenceRepository.findById(sentenceId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy Sentence với ID " + sentenceId));
        sentenceRepository.delete(sentence);
    }

    private TopicDTO convertToDTO(Topic topic) {
        TopicDTO dto = new TopicDTO();
        dto.setId(topic.getId());
        dto.setName(topic.getName());
        return dto;
    }

    private SentenceDTO convertToDTO(Sentence sentence) {
        SentenceDTO dto = new SentenceDTO();
        dto.setId(sentence.getId());
        dto.setText(sentence.getText());
        dto.setTopicId(sentence.getTopic().getId());
        dto.setAudioUrl(sentence.getAudioUrl());
        return dto;
    }
}
