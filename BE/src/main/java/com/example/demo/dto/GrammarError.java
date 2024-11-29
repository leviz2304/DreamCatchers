package com.example.demo.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
class GrammarError {
    private String sentence;
    private String error;
    private String recommendation;
}
