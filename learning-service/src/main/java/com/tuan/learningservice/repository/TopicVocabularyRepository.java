package com.tuan.learningservice.repository;

import com.tuan.learningservice.model.TopicVocabulary;
import com.tuan.learningservice.model.TopicVocabularyId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TopicVocabularyRepository extends JpaRepository<TopicVocabulary, TopicVocabularyId> {
    List<TopicVocabulary> findByTopic_Id(Long topicId);

    List<TopicVocabulary> findByVocabulary_Id(Long vocabularyId);

    void deleteByVocabulary_Id(Long vocabularyId);

    boolean existsByTopic_IdAndVocabulary_Id(Long topicId, Long vocabularyId);
}
