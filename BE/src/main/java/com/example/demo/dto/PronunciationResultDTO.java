package com.example.demo.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PronunciationResultDTO {

    /**
     * ID của câu đã đánh giá
     */
    private Integer sentenceId;

    /**
     * Điểm tổng thể của phát âm
     */
    private Double overallPronunciationScore;

    /**
     * Điểm độ chính xác (Accuracy)
     */
    private Double accuracyScore;

    /**
     * Điểm độ trôi chảy (Fluency)
     */
    private Double fluencyScore;

    /**
     * Điểm độ đầy đủ (Completeness)
     */
    private Double completenessScore;

    /**
     * Phản hồi JSON trả về từ dịch vụ Azure
     */
    private String feedback;

    /**
     * Danh sách các từ bị mispronounced
     */
    private List<String> mispronouncedWords;
}
