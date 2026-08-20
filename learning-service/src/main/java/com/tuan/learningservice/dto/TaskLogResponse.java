package com.tuan.learningservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;

@Data
@AllArgsConstructor
public class TaskLogResponse {
    private LocalDate date;
    private Boolean isCompleted;
}