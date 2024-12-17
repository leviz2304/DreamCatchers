package com.example.demo.entity.data;

import jakarta.persistence.Embeddable;
import jakarta.persistence.Entity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Embeddable
public class EnrollmentId implements Serializable {
    private Integer userId;
    private Integer courseId;

    // equals, hashCode
}
