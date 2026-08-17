package com.tuan.userservice.service;

import com.tuan.userservice.dto.TestResultBestLevel;
import com.tuan.userservice.dto.TestResultCreateRequest;
import com.tuan.userservice.dto.TestResultSummaryResponse;
import com.tuan.userservice.model.TestLevel;
import com.tuan.userservice.model.TestResult;
import com.tuan.userservice.repository.TestResultRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TestResultService {
    private final TestResultRepository testResultRepository;

    @Transactional
    public TestResult create(TestResultCreateRequest request, String userId) {
        TestResult result = new TestResult();
        result.setUserId(userId);
        result.setScore(Optional.ofNullable(request.score()).orElse(0));
        result.setTotal(Optional.ofNullable(request.total()).orElse(0));
        result.setLevel(Optional.ofNullable(request.level()).orElse(TestLevel.A1));
        result.setAnswers(Optional.ofNullable(request.answers()).orElse(List.of()));
        return testResultRepository.save(result);
    }

    @Transactional(readOnly = true)
    public List<TestResult> getHistory(String userId, int limit) {
        return testResultRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .limit(Math.max(limit, 1))
                .toList();
    }

    @Transactional(readOnly = true)
    public TestResultSummaryResponse getSummary(String userId) {
        List<TestResult> history = testResultRepository.findByUserIdOrderByCreatedAtDesc(userId);

        TestResult lastTest = history.isEmpty() ? null : history.getFirst();

        TestResultBestLevel bestLevel = history.stream()
                .filter(Objects::nonNull)
                .max(Comparator.comparingInt(result -> result.getScore() * 1000 + result.getTotal()))
                .map(result -> new TestResultBestLevel(result.getLevel().name(), result.getScore(), result.getTotal()))
                .orElse(null);

        return new TestResultSummaryResponse(lastTest, bestLevel);
    }
}
