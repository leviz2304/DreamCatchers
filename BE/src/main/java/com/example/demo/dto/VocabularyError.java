package com.example.demo.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
class VocabularyError {
    private String word;
    private String error;
    private String recommendation;
}