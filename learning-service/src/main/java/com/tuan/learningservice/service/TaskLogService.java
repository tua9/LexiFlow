package com.tuan.learningservice.service;

import com.tuan.learningservice.dto.TaskLogRequest;
import com.tuan.learningservice.dto.TaskLogResponse;
import com.tuan.learningservice.exception.DuplicateResourceException;
import com.tuan.learningservice.model.TaskLog;
import com.tuan.learningservice.repository.TaskLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TaskLogService {
    private final TaskLogRepository taskLogRepository;
    private final DailyTaskService dailyTaskService;

    @Transactional
    public TaskLogResponse upsert(Long taskId, LocalDate date, TaskLogRequest request) {
        var task = dailyTaskService.ownedTask(taskId);
        TaskLog log = taskLogRepository.findByTaskIdAndDate(taskId, date).orElseGet(() -> {
            TaskLog created = new TaskLog();
            created.setTask(task);
            created.setDate(date);
            return created;
        });
        log.setIsCompleted(request.getIsCompleted());
        try {
            TaskLog saved = taskLogRepository.save(log);
            return new TaskLogResponse(saved.getDate(), saved.getIsCompleted());
        } catch (DataIntegrityViolationException exception) {
            throw new DuplicateResourceException("Task log already exists for this date");
        }
    }

    @Transactional(readOnly = true)
    public List<TaskLogResponse> findByDateRange(Long taskId, LocalDate from, LocalDate to) {
        dailyTaskService.ownedTask(taskId);
        return taskLogRepository.findByTaskIdAndDateBetween(taskId, from, to).stream()
                .map(log -> new TaskLogResponse(log.getDate(), log.getIsCompleted()))
                .toList();
    }
}