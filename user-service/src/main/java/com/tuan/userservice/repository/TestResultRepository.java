package com.tuan.userservice.repository;

import com.tuan.userservice.model.TestResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TestResultRepository extends JpaRepository<TestResult, Long> {
    List<TestResult> findByUserIdOrderByCreatedAtDesc(String userId);

    Optional<TestResult> findTopByUserIdOrderByScoreDescCreatedAtDesc(String userId);

    Optional<TestResult> findTopByUserIdOrderByCreatedAtDesc(String userId);
}
