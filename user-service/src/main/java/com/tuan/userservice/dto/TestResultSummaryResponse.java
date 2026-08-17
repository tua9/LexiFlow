package com.tuan.userservice.dto;

import com.tuan.userservice.model.TestResult;

public record TestResultSummaryResponse(
        TestResult lastTest,
        TestResultBestLevel bestLevel
) {
}
