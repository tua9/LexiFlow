package com.tuan.learningservice.service;

import com.tuan.learningservice.dto.TaskRequest;
import com.tuan.learningservice.dto.TaskResponse;
import com.tuan.learningservice.exception.ForbiddenException;
import com.tuan.learningservice.exception.ResourceNotFoundException;
import com.tuan.learningservice.mapper.DailyTaskMapper;
import com.tuan.learningservice.model.Task;
import com.tuan.learningservice.repository.DailyTaskGroupRepository;
import com.tuan.learningservice.repository.TaskRepository;
import com.tuan.learningservice.utils.CurrentUser;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class DailyTaskService {
    private final TaskRepository taskRepository;
    private final DailyTaskGroupRepository groupRepository;

    @Transactional
    public TaskResponse create(Long groupId, TaskRequest request) {
        var group = groupRepository.findById(groupId)
                .orElseThrow(() -> new ResourceNotFoundException("Daily task group not found"));
        ensureOwner(group.getUserId());
        Task task = new Task();
        task.setGroup(group);
        task.setName(request.getName());
        task.setOrderIndex(request.getOrderIndex());
        return DailyTaskMapper.toTaskResponse(taskRepository.save(task), java.util.Collections.emptyList());
    }

    @Transactional
    public TaskResponse update(Long taskId, TaskRequest request) {
        Task task = ownedTask(taskId);
        task.setName(request.getName());
        task.setOrderIndex(request.getOrderIndex());
        return DailyTaskMapper.toTaskResponse(taskRepository.save(task), java.util.Collections.emptyList());
    }

    @Transactional
    public void delete(Long taskId) {
        taskRepository.delete(ownedTask(taskId));
    }

    @Transactional
    public void updateOrder(Long taskId, Integer orderIndex) {
        Task task = ownedTask(taskId);
        task.setOrderIndex(orderIndex);
    }

    public Task ownedTask(Long taskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));
        ensureOwner(task.getGroup().getUserId());
        return task;
    }

    private void ensureOwner(String ownerId) {
        if (!ownerId.equals(CurrentUser.getKeycloakId())) {
            throw new ForbiddenException("You do not have access to this task");
        }
    }
}