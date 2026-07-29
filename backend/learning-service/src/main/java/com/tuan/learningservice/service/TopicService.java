package com.tuan.learningservice.service;

import com.tuan.learningservice.dto.CopyTopicRequest;
import com.tuan.learningservice.dto.TopicRequest;
import com.tuan.learningservice.dto.TopicResponse;
import com.tuan.learningservice.dto.VocabularyResponse;
import com.tuan.learningservice.mapper.VocabularyMapper;
import com.tuan.learningservice.mapper.TopicMapper;
import com.tuan.learningservice.model.Topic;
import com.tuan.learningservice.model.TopicVocabulary;
import com.tuan.learningservice.model.TopicVocabularyId;
import com.tuan.learningservice.model.Vocabulary;
import com.tuan.learningservice.repository.TopicRepository;
import com.tuan.learningservice.repository.TopicVocabularyRepository;
import com.tuan.learningservice.repository.VocabularyRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TopicService {

    private final TopicRepository topicRepository;
    private final VocabularyRepository vocabularyRepository;
    private final TopicVocabularyRepository topicVocabularyRepository;

    @Transactional(readOnly = true)
    public List<TopicResponse> findAll() {
        return topicRepository.findAll().stream()
                .map(TopicMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public TopicResponse findById(Long id) {
        return topicRepository.findById(id)
                .map(TopicMapper::toResponse)
                .orElseThrow(() -> new EntityNotFoundException("Topic not found with id: " + id));
    }

    @Transactional(readOnly = true)
    public List<TopicResponse> findByUserId(String userId) {
        return topicRepository.findByUserId(userId).stream()
                .map(TopicMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<TopicResponse> findPublicTopics() {
        return topicRepository.findByIsPublicTrue().stream()
                .map(TopicMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<VocabularyResponse> findVocabulariesByTopicId(Long topicId) {
        if (!topicRepository.existsById(topicId)) {
            throw new EntityNotFoundException("Topic not found with id: " + topicId);
        }
        return topicVocabularyRepository.findByTopic_Id(topicId).stream()
                .map(TopicVocabulary::getVocabulary)
                .map(VocabularyMapper::toResponse)
                .toList();
    }

    @Transactional
    public TopicResponse create(TopicRequest request) {
        Topic topic = TopicMapper.toEntity(request);
        topic.setProgress(new BigDecimal("0.0"));
        return TopicMapper.toResponse(topicRepository.save(topic));
    }

    @Transactional
    public TopicResponse update(Long id, TopicRequest request) {
        Topic topic = topicRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Topic not found with id: " + id));
        TopicMapper.updateEntity(topic, request);
        return TopicMapper.toResponse(topicRepository.save(topic));
    }

    @Transactional
    public TopicResponse copyTopic(Long topicId, CopyTopicRequest request) {
        Topic originalTopic = topicRepository.findById(topicId)
                .orElseThrow(() -> new EntityNotFoundException("Topic not found with id: " + topicId));

        TopicRequest newTopicRequest = new TopicRequest();
        newTopicRequest.setName(originalTopic.getName() + " (Copy)");
        newTopicRequest.setDescription(originalTopic.getDescription());
        newTopicRequest.setUrlImage(originalTopic.getUrlImage());
        newTopicRequest.setProgress(originalTopic.getProgress());
        newTopicRequest.setColor(originalTopic.getColor());
        newTopicRequest.setIsPublic(request != null && request.getIsPublic() != null ? request.getIsPublic() : originalTopic.getIsPublic());
        newTopicRequest.setUserId(request != null && request.getUserId() != null && !request.getUserId().isBlank()
                ? request.getUserId()
                : originalTopic.getUserId());

        Topic copiedTopic = topicRepository.save(TopicMapper.toEntity(newTopicRequest));

        List<TopicVocabulary> relations = topicVocabularyRepository.findByTopic_Id(topicId);
        for (TopicVocabulary relation : relations) {
            TopicVocabularyId newRelationId = new TopicVocabularyId();
            newRelationId.setTopicId(copiedTopic.getId());
            newRelationId.setVocabularyId(relation.getVocabulary().getId());

            TopicVocabulary copiedRelation = new TopicVocabulary();
            copiedRelation.setId(newRelationId);
            copiedRelation.setTopic(copiedTopic);
            copiedRelation.setVocabulary(relation.getVocabulary());
            topicVocabularyRepository.save(copiedRelation);
        }

        return TopicMapper.toResponse(copiedTopic);
    }

    @Transactional
    public void addVocabularyToTopic(Long topicId, Long vocabularyId) {
        Topic topic = topicRepository.findById(topicId)
                .orElseThrow(() -> new EntityNotFoundException("Topic not found with id: " + topicId));
        Vocabulary vocabulary = vocabularyRepository.findById(vocabularyId)
                .orElseThrow(() -> new EntityNotFoundException("Vocabulary not found with id: " + vocabularyId));

        if (topicVocabularyRepository.existsByTopic_IdAndVocabulary_Id(topicId, vocabularyId)) {
            throw new RuntimeException("Word exist");
        }

        TopicVocabularyId relationId = new TopicVocabularyId();
        relationId.setTopicId(topic.getId());
        relationId.setVocabularyId(vocabulary.getId());

        if (topicVocabularyRepository.existsById(relationId)) {
            return;
        }

        TopicVocabulary topicVocabulary = new TopicVocabulary();
        topicVocabulary.setId(relationId);
        topicVocabulary.setTopic(topic);
        topicVocabulary.setVocabulary(vocabulary);
        topicVocabularyRepository.save(topicVocabulary);
    }

    @Transactional
    public void delete(Long id) {
        if (!topicRepository.existsById(id)) {
            throw new EntityNotFoundException("Topic not found with id: " + id);
        }
        topicRepository.deleteById(id);
    }
}
