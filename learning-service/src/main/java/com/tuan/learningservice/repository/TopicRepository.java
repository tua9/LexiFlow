package com.tuan.learningservice.repository;

import com.tuan.learningservice.model.Topic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TopicRepository extends JpaRepository<Topic, Long> {
    List<Topic> findByUserId(String userId);

    List<Topic> findByIsPublicTrue();
}
