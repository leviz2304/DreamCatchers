package com.example.demo.service;

import com.google.auth.oauth2.ServiceAccountCredentials;
import com.google.cloud.storage.BlobId;
import com.google.cloud.storage.BlobInfo;
import com.google.cloud.storage.Storage;
import com.google.cloud.storage.StorageOptions;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.FileInputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.UUID;
@Slf4j
@Service
public class AudioStorageService {

    private final Storage storage;
    private final String bucketName = "eliteproject";

    // AudioStorageService.java
    public AudioStorageService() {
        try {
            // Đường dẫn đến tệp JSON của tài khoản dịch vụ
            String jsonPath = "D:/DACN/Cloud/google-speech-key.json"; // Thay đổi đường dẫn này

            // Tạo đối tượng Storage với thông tin xác thực từ tệp JSON
            storage = StorageOptions.newBuilder()
                    .setCredentials(ServiceAccountCredentials.fromStream(new FileInputStream(jsonPath)))
                    .setProjectId("modern-photon-442512-j8") // Thay đổi ID dự án của bạn
                    .build()
                    .getService();
        } catch (IOException e) {
            log.error("Không thể tải tệp JSON của tài khoản dịch vụ", e);
            throw new RuntimeException("Failed to initialize Google Cloud Storage client", e);
        }
    }
    public String uploadAudio(byte[] audioData, String originalFileName, String contentType) {
        try {
            String uniqueFileName = UUID.randomUUID().toString() + "_" + originalFileName;
            BlobId blobId = BlobId.of(bucketName, "audio/" + uniqueFileName);
            BlobInfo blobInfo = BlobInfo.newBuilder(blobId).setContentType(contentType).build();
            storage.create(blobInfo, audioData);
            return String.format("https://storage.googleapis.com/%s/audio/%s", bucketName, uniqueFileName);
        } catch (Exception e) {
            throw new RuntimeException("Failed to upload audio to Google Cloud Storage", e);
        }
    }


}
