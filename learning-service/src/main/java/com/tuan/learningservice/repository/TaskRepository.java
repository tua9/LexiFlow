package com.tuan.learningservice.repository;

import com.tuan.learningservice.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByGroupIdOrderByOrderIndexAscIdAsc(Long groupId);

    Optional<Task> findByIdAndGroupUserId(Long id, String userId);
}