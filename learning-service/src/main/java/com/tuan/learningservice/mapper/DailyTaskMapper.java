package com.tuan.learningservice.mapper;

import com.tuan.learningservice.dto.DailyTaskGroupResponse;
import com.tuan.learningservice.dto.TaskLogResponse;
import com.tuan.learningservice.dto.TaskResponse;
import com.tuan.learningservice.model.DailyTaskGroup;
import com.tuan.learningservice.model.Task;
import com.tuan.learningservice.model.TaskLog;

import java.util.List;

public final class DailyTaskMapper {
    private DailyTaskMapper() {
    }

    public static DailyTaskGroupResponse toGroupResponse(DailyTaskGroup group, List<TaskResponse> tasks) {
        return new DailyTaskGroupResponse(group.getId(), group.getTitle(), group.getDescription(), tasks,
                group.getCreatedAt(), group.getUpdatedAt());
    }

    public static TaskResponse toTaskResponse(Task task, List<TaskLog> logs) {
        List<TaskLogResponse> logResponses = logs.stream()
                .map(log -> new TaskLogResponse(log.getDate(), log.getIsCompleted()))
                .toList();
        return new TaskResponse(task.getId(), task.getName(), task.getOrderIndex(), logResponses, task.getCreatedAt());
    }
}