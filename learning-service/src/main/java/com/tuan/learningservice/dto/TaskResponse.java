package com.tuan.learningservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.OffsetDateTime;
import java.util.List;

@Data
@AllArgsConstructor
public class TaskResponse {
    private Long id;
    private String name;
    private Integer orderIndex;
    private List<TaskLogResponse> logs;
    private OffsetDateTime createdAt;
}