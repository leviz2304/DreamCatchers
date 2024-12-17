package com.example.demo.cloudinary;

import com.cloudinary.Cloudinary;
import com.cloudinary.EagerTransformation;
import com.cloudinary.utils.ObjectUtils;
import com.example.demo.entity.data.SpeakingFeedback;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CloudService {
    private final Cloudinary cloud;

    public String uploadImage(byte[] file)  {
        try {
            Map map = cloud.uploader().upload(file, ObjectUtils.asMap("resource_type", "auto", "folder", "dacs"));
            if(map != null) {
                return (map.get("secure_url").toString());
            }
        }
        catch (Exception e) {
            System.out.println("getLinkCloud: " + e.getMessage());
            return null;
        }
        return null;
    }

    public List<String> uploadVideos(List<MultipartFile> filesData){
        List<String> secureUrls = new ArrayList<>();
        for (var fileData : filesData) {
           try {
               Map map = cloud.uploader().upload(fileData.getBytes(),
                       ObjectUtils.asMap("resource_type", "video",
                               "folder", "dacs",
                               "eager", Arrays.asList(
                                       new EagerTransformation().width(300).height(300).crop("pad").audioCodec("none"),
                                       new EagerTransformation().width(160).height(100).crop("crop").gravity("south").audioCodec("none")),
                               "eager_async", true));
//                            "eager_notification_url", "https://mysite.example.com/notify_endpoint"));
               secureUrls.add(map.get("secure_url").toString());
           } catch (Exception e) {
               System.out.println("Upload videos: " + e.getMessage());
           }
        }
        return secureUrls;
    }

    public String uploadVideo(byte[] video) {
        try {
            Map map = cloud.uploader().upload(video,
                    ObjectUtils.asMap("resource_type", "video",
                            "folder", "dacs",
                            "eager", Arrays.asList(
                                    new EagerTransformation().width(300).height(300).crop("pad").audioCodec("none"),
                                    new EagerTransformation().width(160).height(100).crop("crop").gravity("south").audioCodec("none")),
                            "eager_async", true));
//                            "eager_notification_url", "https://mysite.example.com/notify_endpoint"));

        }
        catch (Exception e) {
            System.out.println("Cloud upload video: " + e.getMessage());
        }
        return null;
    }

    @Async("asyncExecutor")

    public String uploadAudio(byte[] audioFile) {
        try {
            Map<?, ?> map = cloud.uploader().upload(audioFile, ObjectUtils.asMap(
                    "resource_type", "audio",
                    "folder", "dacs/audio"
            ));

            if (map != null && map.get("secure_url") != null) {
                return map.get("secure_url").toString();
            }
        } catch (Exception e) {
            System.err.println("uploadAudio Exception: " + e.getMessage());
            if (e.getCause() != null) {
                System.err.println("Cause: " + e.getCause().getMessage());
            }
            e.printStackTrace();
        }

        return null;
    }






    /**
     * Uploads multiple audio files to Cloudinary.
     *
     * @param audioFiles List of MultipartFile representing audio files.
     * @return List of secure URLs for the uploaded audio files.
     */
    public List<String> uploadAudios(List<MultipartFile> audioFiles) {
        List<String> secureUrls = new ArrayList<>();
        for (MultipartFile audioFile : audioFiles) {
            try {
                // Kiểm tra loại file audio
                if (!audioFile.getContentType().startsWith("audio/")) {
                    System.err.println("Invalid audio format: " + audioFile.getOriginalFilename());
                    continue;
                }
                Map<?, ?> map = cloud.uploader().upload(audioFile.getBytes(),
                        ObjectUtils.asMap(
                                "resource_type", "audio",
                                "folder", "dacs/audio",
                                "transformation", Arrays.asList(
                                        new EagerTransformation().quality("auto")
                                )
                        ));
                if (map != null && map.get("secure_url") != null) {
                    secureUrls.add(map.get("secure_url").toString());
                }
            } catch (Exception e) {
                System.err.println("Error uploading audio file " + audioFile.getOriginalFilename() + ": " + e.getMessage());
                e.printStackTrace();
            }
        }
        return secureUrls;
    }


    /**
     * Asynchronously uploads an audio file and associates it with an entity.
     * Adjust this method based on your specific requirements.
     *
     * @param audioFile Byte array of the audio file.
     * @param targetEntity The entity to associate the audio with (e.g., SpeakingFeedback).
     */
    @Async("asyncExecutor")
    public void saveAudioToEntity(byte[] audioFile, Object targetEntity) {
        try {
            String audioUrl = uploadAudio(audioFile);
            if (audioUrl != null) {
                // Liên kết với entity cụ thể
                if (targetEntity instanceof SpeakingFeedback) {
                    ((SpeakingFeedback) targetEntity).setAudioUrl(audioUrl);
                    System.out.println("Audio URL successfully saved to entity: " + audioUrl);
                } else {
                    System.err.println("Unknown entity type. Audio URL not saved.");
                }
            } else {
                System.err.println("Failed to upload audio file.");
            }
        } catch (Exception e) {
            System.err.println("Error saving audio to entity: " + e.getMessage());
            e.printStackTrace();
        }
    }

}
