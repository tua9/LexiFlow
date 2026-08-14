package com.tuan.learningservice.config;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
public class ErrorResponse {

    private int status;
    private String error;
    private String message;
    private LocalDateTime timestamp;
}
