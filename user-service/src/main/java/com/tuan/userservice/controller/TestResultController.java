package com.tuan.userservice.controller;

import com.tuan.userservice.dto.TestResultCreateRequest;
import com.tuan.userservice.dto.TestResultSummaryResponse;
import com.tuan.userservice.model.TestResult;
import com.tuan.userservice.service.TestResultService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class TestResultController {
    private final TestResultService testResultService;

    @GetMapping("/test-results")
    public ResponseEntity<List<TestResult>> getHistory(@RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(testResultService.getHistory("current-user", limit));
    }

    @GetMapping("/test-results/summary")
    public ResponseEntity<TestResultSummaryResponse> getSummary() {
        return ResponseEntity.ok(testResultService.getSummary("current-user"));
    }

    @PostMapping("/test-results")
    public ResponseEntity<TestResult> create(@RequestBody TestResultCreateRequest request) {
        TestResult created = testResultService.create(request, "current-user");
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
}
