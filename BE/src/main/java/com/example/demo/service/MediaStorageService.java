package com.example.demo.service;

import com.example.demo.dto.MediaResponseDTO;
import com.google.auth.oauth2.ServiceAccountCredentials;
import com.google.cloud.storage.BlobId;
import com.google.cloud.storage.BlobInfo;
import com.google.cloud.storage.Storage;
import com.google.cloud.storage.StorageOptions;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.FileInputStream;
import java.io.IOException;
import java.util.UUID;

@Slf4j
@Service
public class MediaStorageService {

    private final Storage storage;
    private final String bucketName = "eliteproject"; // Thay bằng bucket của bạn

    public MediaStorageService() {
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

    public MediaResponseDTO uploadFile(MultipartFile file, String folder) {
        try {
            String uniqueFileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            String filePath = folder + "/" + uniqueFileName;
            BlobId blobId = BlobId.of(bucketName, filePath);
            BlobInfo blobInfo = BlobInfo.newBuilder(blobId).setContentType(file.getContentType()).build();
            storage.create(blobInfo, file.getBytes());
            String fileUrl = String.format("https://storage.googleapis.com/%s/%s", bucketName, filePath);
            return MediaResponseDTO.builder()
                    .url(fileUrl)
                    .fileName(uniqueFileName)
                    .build();
        } catch (Exception e) {
            log.error("Failed to upload file: " + file.getOriginalFilename(), e);
            throw new RuntimeException("Failed to upload file: " + file.getOriginalFilename(), e);
        }
    }

}
