package com.tuan.userservice.dto;

import com.tuan.userservice.model.TestLevel;

import java.util.List;
import java.util.Map;

public record TestResultCreateRequest(
        Integer score,
        Integer total,
        TestLevel level,
        List<Map<String, Object>> answers
) {
}
