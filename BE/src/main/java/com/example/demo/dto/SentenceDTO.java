package com.example.demo.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class SentenceDTO {
    private Integer id;
    private String text;
    private Integer topicId;
    private String audioUrl;

}
