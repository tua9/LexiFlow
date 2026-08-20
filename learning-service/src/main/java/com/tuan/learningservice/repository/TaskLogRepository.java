package com.tuan.learningservice.repository;

import com.tuan.learningservice.model.TaskLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface TaskLogRepository extends JpaRepository<TaskLog, Long> {
    Optional<TaskLog> findByTaskIdAndDate(Long taskId, LocalDate date);

    List<TaskLog> findByTaskIdInAndDateBetween(List<Long> taskIds, LocalDate from, LocalDate to);

    List<TaskLog> findByTaskIdAndDateBetween(Long taskId, LocalDate from, LocalDate to);
}