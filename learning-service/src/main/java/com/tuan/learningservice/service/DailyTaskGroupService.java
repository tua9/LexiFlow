package com.tuan.learningservice.service;

import com.tuan.learningservice.dto.DailyTaskGroupRequest;
import com.tuan.learningservice.dto.DailyTaskGroupResponse;
import com.tuan.learningservice.dto.TaskResponse;
import com.tuan.learningservice.exception.ForbiddenException;
import com.tuan.learningservice.exception.ResourceNotFoundException;
import com.tuan.learningservice.mapper.DailyTaskMapper;
import com.tuan.learningservice.model.DailyTaskGroup;
import com.tuan.learningservice.model.Task;
import com.tuan.learningservice.model.TaskLog;
import com.tuan.learningservice.repository.DailyTaskGroupRepository;
import com.tuan.learningservice.repository.TaskLogRepository;
import com.tuan.learningservice.repository.TaskRepository;
import com.tuan.learningservice.utils.CurrentUser;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DailyTaskGroupService {
    private final DailyTaskGroupRepository groupRepository;
    private final TaskRepository taskRepository;
    private final TaskLogRepository taskLogRepository;

    @Transactional
    public DailyTaskGroupResponse create(DailyTaskGroupRequest request) {
        DailyTaskGroup group = new DailyTaskGroup();
        group.setUserId(CurrentUser.getKeycloakId());
        group.setTitle(request.getTitle());
        group.setDescription(request.getDescription());
        return toResponse(groupRepository.save(group), null, null);
    }

    @Transactional
    public List<DailyTaskGroupResponse> findAll() {
        String userId = CurrentUser.getKeycloakId();
        List<DailyTaskGroup> groups = groupRepository.findByUserIdOrderByCreatedAtDesc(userId);
        if (groups.isEmpty()) {
            DailyTaskGroup defaultGroup = new DailyTaskGroup();
            defaultGroup.setUserId(userId);
            defaultGroup.setTitle("Daily task");
            groups = List.of(groupRepository.save(defaultGroup));
        }
        return groups.stream()
                .map(group -> toResponse(group, Collections.emptyList(), Collections.emptyMap()))
                .toList();
    }

    @Transactional(readOnly = true)
    public DailyTaskGroupResponse findById(Long groupId, LocalDate from, LocalDate to) {
        DailyTaskGroup group = ownedGroup(groupId);
        List<Task> tasks = taskRepository.findByGroupIdOrderByOrderIndexAscIdAsc(groupId);
        Map<Long, List<TaskLog>> logs = logsByTask(tasks, from, to);
        return toResponse(group, tasks, logs);
    }

    @Transactional
    public DailyTaskGroupResponse update(Long groupId, DailyTaskGroupRequest request) {
        DailyTaskGroup group = ownedGroup(groupId);
        group.setTitle(request.getTitle());
        group.setDescription(request.getDescription());
        return toResponse(groupRepository.save(group), null, null);
    }

    @Transactional
    public void delete(Long groupId) {
        groupRepository.delete(ownedGroup(groupId));
    }

    private DailyTaskGroup ownedGroup(Long groupId) {
        DailyTaskGroup group = groupRepository.findById(groupId)
                .orElseThrow(() -> new ResourceNotFoundException("Daily task group not found"));
        if (!group.getUserId().equals(CurrentUser.getKeycloakId())) {
            throw new ForbiddenException("You do not have access to this daily task group");
        }
        return group;
    }

    private Map<Long, List<TaskLog>> logsByTask(List<Task> tasks, LocalDate from, LocalDate to) {
        List<Long> taskIds = tasks.stream()
                .map(Task::getId).toList();
        if (taskIds.isEmpty() || from == null || to == null) return Collections.emptyMap();
        return taskLogRepository.findByTaskIdInAndDateBetween(taskIds, from, to).stream()
                .collect(Collectors.groupingBy(log -> log.getTask().getId()));
    }

    private DailyTaskGroupResponse toResponse(DailyTaskGroup group, List<Task> tasks, Map<Long, List<TaskLog>> logs) {
        if (tasks == null) return DailyTaskMapper.toGroupResponse(group, Collections.emptyList());
        List<TaskResponse> responses = tasks.stream()
                .map(task -> DailyTaskMapper.toTaskResponse(task, logs.getOrDefault(task.getId(), Collections.emptyList())))
                .toList();
        return DailyTaskMapper.toGroupResponse(group, responses);
    }
}