package com.tuan.learningservice.repository;

import com.tuan.learningservice.model.DailyTaskGroup;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface DailyTaskGroupRepository extends JpaRepository<DailyTaskGroup, Long> {
    List<DailyTaskGroup> findByUserIdOrderByCreatedAtDesc(String userId);

    Optional<DailyTaskGroup> findByIdAndUserId(Long id, String userId);
}