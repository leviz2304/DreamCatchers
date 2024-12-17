package com.example.demo.service;

import com.google.auth.oauth2.ServiceAccountCredentials;
import com.google.cloud.storage.BlobId;
import com.google.cloud.storage.BlobInfo;
import com.google.cloud.storage.StorageOptions;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import com.google.cloud.storage.Storage;

import java.io.FileInputStream;
import java.io.IOException;
import java.util.UUID;

@Slf4j
@Service
public class VideoStorageService {

    private final Storage storage;
    private final String bucketName = "eliteproject";

    public VideoStorageService() {
        try {
            String jsonPath = "D:/DACN/Cloud/google-speech-key.json"; // Thay đổi đường dẫn này
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

    public String uploadVideo(byte[] videoData, String originalFileName, String contentType) {
        try {
            String uniqueFileName = UUID.randomUUID().toString() + "_" + originalFileName;
            BlobId blobId = BlobId.of(bucketName, "videos/" + uniqueFileName);
            BlobInfo blobInfo = BlobInfo.newBuilder(blobId).setContentType(contentType).build();
            storage.create(blobInfo, videoData);
            return String.format("https://storage.googleapis.com/%s/videos/%s", bucketName, uniqueFileName);
        } catch (Exception e) {
            throw new RuntimeException("Failed to upload video to Google Cloud Storage", e);
        }
    }
}