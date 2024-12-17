package com.example.demo.entity.data;

import com.example.demo.entity.user.User;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties({"hibernateLazyInitializer","handler"})

public class CommonGrammarIssue {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @JsonIgnore // Bỏ qua trường user khi serialize
    private User user;

    @Column(length = 5000)
    private String commonErrorsJson;
    // JSON lưu danh sách 3 lỗi ngữ pháp thường gặp, dạng:
    // {
    //   "issues": [
    //     {
    //       "error": "S-V agreement",
    //       "example": "He go to school",
    //       "recommendation": "He goes to school"
    //     },
    //     ...
    //   ]
    // }

    private LocalDateTime createdAt;
}
