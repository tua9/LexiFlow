package com.tuan.learningservice.controller;

import com.tuan.learningservice.dto.DailyTaskGroupRequest;
import com.tuan.learningservice.dto.DailyTaskGroupResponse;
import com.tuan.learningservice.dto.TaskRequest;
import com.tuan.learningservice.dto.TaskResponse;
import com.tuan.learningservice.service.DailyTaskGroupService;
import com.tuan.learningservice.service.DailyTaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1/daily-task-groups")
@RequiredArgsConstructor
public class DailyTaskGroupController {
    private final DailyTaskGroupService groupService;
    private final DailyTaskService taskService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public DailyTaskGroupResponse create(@Valid @RequestBody DailyTaskGroupRequest request) {
        return groupService.create(request);
    }

    @GetMapping
    public List<DailyTaskGroupResponse> findAll() {
        return groupService.findAll();
    }

    @GetMapping("/{groupId}/logs")
    public DailyTaskGroupResponse findLogs(@PathVariable Long groupId,
                                           @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
                                           @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        if (from.isAfter(to)) {
            throw new IllegalArgumentException("from must not be after to");
        }
        return groupService.findById(groupId, from, to);
    }

    @PutMapping("/{groupId}")
    public DailyTaskGroupResponse update(@PathVariable Long groupId, @Valid @RequestBody DailyTaskGroupRequest request) {
        return groupService.update(groupId, request);
    }

    @PostMapping("/{groupId}/tasks")
    @ResponseStatus(HttpStatus.CREATED)
    public TaskResponse createTask(@PathVariable Long groupId, @Valid @RequestBody TaskRequest request) {
        return taskService.create(groupId, request);
    }
}