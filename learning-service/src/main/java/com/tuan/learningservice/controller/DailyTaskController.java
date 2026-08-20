package com.tuan.learningservice.controller;

import com.tuan.learningservice.dto.TaskLogRequest;
import com.tuan.learningservice.dto.TaskLogResponse;
import com.tuan.learningservice.dto.TaskOrderRequest;
import com.tuan.learningservice.dto.TaskRequest;
import com.tuan.learningservice.dto.TaskResponse;
import com.tuan.learningservice.service.DailyTaskService;
import com.tuan.learningservice.service.TaskLogService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1/tasks")
@RequiredArgsConstructor
public class DailyTaskController {
    private final DailyTaskService taskService;
    private final TaskLogService taskLogService;

    @PutMapping("/{taskId}")
    public TaskResponse update(@PathVariable Long taskId, @Valid @RequestBody TaskRequest request) {
        return taskService.update(taskId, request);
    }

    @DeleteMapping("/{taskId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long taskId) {
        taskService.delete(taskId);
    }

    @PatchMapping("/{taskId}/order")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void updateOrder(@PathVariable Long taskId, @Valid @RequestBody TaskOrderRequest request) {
        taskService.updateOrder(taskId, request.getOrderIndex());
    }

    @PutMapping("/{taskId}/logs/{date}")
    public TaskLogResponse upsertLog(@PathVariable Long taskId,
                                     @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
                                     @Valid @RequestBody TaskLogRequest request) {
        return taskLogService.upsert(taskId, date, request);
    }

    @GetMapping("/{taskId}/logs")
    public List<TaskLogResponse> findLogs(@PathVariable Long taskId,
                                          @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
                                          @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        if (from.isAfter(to)) {
            throw new IllegalArgumentException("from must not be after to");
        }
        return taskLogService.findByDateRange(taskId, from, to);
    }
}