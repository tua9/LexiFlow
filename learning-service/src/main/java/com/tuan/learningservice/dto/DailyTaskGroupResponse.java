package com.tuan.learningservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.OffsetDateTime;
import java.util.List;

@Data
@AllArgsConstructor
public class DailyTaskGroupResponse {
    private Long id;
    private String title;
    private String description;
    private List<TaskResponse> tasks;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;
}