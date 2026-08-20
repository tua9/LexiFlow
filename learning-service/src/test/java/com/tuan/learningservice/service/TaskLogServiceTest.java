package com.tuan.learningservice.service;

import com.tuan.learningservice.dto.TaskLogRequest;
import com.tuan.learningservice.dto.TaskLogResponse;
import com.tuan.learningservice.exception.DuplicateResourceException;
import com.tuan.learningservice.model.Task;
import com.tuan.learningservice.model.TaskLog;
import com.tuan.learningservice.repository.TaskLogRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.dao.DataIntegrityViolationException;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class TaskLogServiceTest {
    @Mock
    private TaskLogRepository taskLogRepository;

    @Mock
    private DailyTaskService dailyTaskService;

    private TaskLogService service;

    @BeforeEach
    void setUp() {
        service = new TaskLogService(taskLogRepository, dailyTaskService);
        when(dailyTaskService.ownedTask(1L)).thenReturn(new Task());
    }

    @Test
    void createsLogWhenDateDoesNotExist() {
        LocalDate date = LocalDate.of(2026, 8, 19);
        when(taskLogRepository.findByTaskIdAndDate(1L, date)).thenReturn(Optional.empty());
        TaskLog saved = log(date, true);
        when(taskLogRepository.save(any(TaskLog.class))).thenReturn(saved);

        TaskLogResponse response = service.upsert(1L, date, new TaskLogRequest(true));

        assertEquals(date, response.getDate());
        assertEquals(true, response.getIsCompleted());
        verify(taskLogRepository).save(any(TaskLog.class));
    }

    @Test
    void updatesExistingLog() {
        LocalDate date = LocalDate.of(2026, 8, 19);
        TaskLog existing = log(date, false);
        when(taskLogRepository.findByTaskIdAndDate(1L, date)).thenReturn(Optional.of(existing));
        when(taskLogRepository.save(existing)).thenReturn(existing);

        TaskLogResponse response = service.upsert(1L, date, new TaskLogRequest(true));

        assertEquals(true, response.getIsCompleted());
        verify(taskLogRepository).save(existing);
    }

    @Test
    void translatesConcurrentDuplicateIntoConflict() {
        LocalDate date = LocalDate.of(2026, 8, 19);
        when(taskLogRepository.findByTaskIdAndDate(1L, date)).thenReturn(Optional.empty());
        when(taskLogRepository.save(any(TaskLog.class))).thenThrow(new DataIntegrityViolationException("unique"));

        assertThrows(DuplicateResourceException.class,
                () -> service.upsert(1L, date, new TaskLogRequest(true)));
    }

    @Test
    void returnsLogsWithinDateRange() {
        LocalDate from = LocalDate.of(2026, 8, 1);
        LocalDate to = LocalDate.of(2026, 8, 31);
        when(taskLogRepository.findByTaskIdAndDateBetween(1L, from, to))
                .thenReturn(List.of(log(LocalDate.of(2026, 8, 19), true)));

        List<TaskLogResponse> response = service.findByDateRange(1L, from, to);

        assertEquals(1, response.size());
        assertEquals(LocalDate.of(2026, 8, 19), response.getFirst().getDate());
    }

    private TaskLog log(LocalDate date, boolean completed) {
        TaskLog log = new TaskLog();
        log.setDate(date);
        log.setIsCompleted(completed);
        return log;
    }
}