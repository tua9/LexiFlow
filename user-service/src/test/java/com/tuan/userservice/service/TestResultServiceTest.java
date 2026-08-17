package com.tuan.userservice.service;

import com.tuan.userservice.dto.TestResultCreateRequest;
import com.tuan.userservice.model.TestLevel;
import com.tuan.userservice.model.TestResult;
import com.tuan.userservice.repository.TestResultRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class TestResultServiceTest {

    @Mock
    private TestResultRepository testResultRepository;

    @InjectMocks
    private TestResultService testResultService;

    @Test
    void shouldCreateAndReturnSummary() {
        TestResult created = new TestResult();
        created.setId(1L);
        created.setUserId("user-123");
        created.setScore(8);
        created.setTotal(10);
        created.setLevel(TestLevel.A1);
        created.setAnswers(List.of(Map.of("questionId", 1, "selected", "A")));
        created.setCreatedAt(OffsetDateTime.now());

        when(testResultRepository.save(any(TestResult.class))).thenReturn(created);
        when(testResultRepository.findByUserIdOrderByCreatedAtDesc("user-123")).thenReturn(List.of(created));

        TestResultCreateRequest request = new TestResultCreateRequest(
                8,
                10,
                TestLevel.A1,
                List.of(Map.of("questionId", 1, "selected", "A"))
        );

        TestResult saved = testResultService.create(request, "user-123");

        assertThat(saved.getScore()).isEqualTo(8);
        assertThat(saved.getLevel()).isEqualTo(TestLevel.A1);
        assertThat(testResultService.getSummary("user-123").lastTest()).isNotNull();
    }
}
