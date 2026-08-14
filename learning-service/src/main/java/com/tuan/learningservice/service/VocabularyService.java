package com.tuan.learningservice.service;

import com.tuan.learningservice.dto.VocabularyRequest;
import com.tuan.learningservice.dto.VocabularyResponse;
import com.tuan.learningservice.mapper.VocabularyMapper;
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

import java.util.List;

@Service
@RequiredArgsConstructor
public class VocabularyService {

    private final VocabularyRepository vocabularyRepository;
    private final TopicRepository topicRepository;
    private final TopicVocabularyRepository topicVocabularyRepository;

    @Transactional(readOnly = true)
    public List<VocabularyResponse> findAll() {
        return vocabularyRepository.findAll().stream()
                .map(VocabularyMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<VocabularyResponse> findByTopicId(Long topicId) {
        return topicVocabularyRepository.findByTopic_Id(topicId).stream()
                .map(TopicVocabulary::getVocabulary)
                .map(VocabularyMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public VocabularyResponse findById(Long id) {
        return vocabularyRepository.findById(id)
                .map(VocabularyMapper::toResponse)
                .orElseThrow(() -> new EntityNotFoundException("Vocabulary not found with id: " + id));
    }

    @Transactional
    public VocabularyResponse create(VocabularyRequest request) {
        Vocabulary vocabulary = VocabularyMapper.toEntity(request);
        Vocabulary savedVocabulary = vocabularyRepository.save(vocabulary);

        return VocabularyMapper.toResponse(savedVocabulary);
    }

    @Transactional
    public VocabularyResponse update(Long id, VocabularyRequest request) {
        Vocabulary vocabulary = vocabularyRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Vocabulary not found with id: " + id));
        VocabularyMapper.updateEntity(vocabulary, request);
        Vocabulary updatedVocabulary = vocabularyRepository.save(vocabulary);

        if (request.getTopicId() != null) {
            Topic topic = topicRepository.findById(request.getTopicId())
                    .orElseThrow(() -> new EntityNotFoundException("Topic not found with id: " + request.getTopicId()));

            TopicVocabularyId relationId = new TopicVocabularyId();
            relationId.setTopicId(topic.getId());
            relationId.setVocabularyId(updatedVocabulary.getId());

            TopicVocabulary existingRelation = topicVocabularyRepository.findById(relationId).orElse(null);
            if (existingRelation == null) {
                TopicVocabulary topicVocabulary = new TopicVocabulary();
                topicVocabulary.setId(relationId);
                topicVocabulary.setTopic(topic);
                topicVocabulary.setVocabulary(updatedVocabulary);
                topicVocabularyRepository.save(topicVocabulary);
            }
        }

        return VocabularyMapper.toResponse(updatedVocabulary);
    }

    @Transactional
    public void delete(Long id) {
        if (!vocabularyRepository.existsById(id)) {
            throw new EntityNotFoundException("Vocabulary not found with id: " + id);
        }
        topicVocabularyRepository.deleteByVocabulary_Id(id);
        vocabularyRepository.deleteById(id);
    }
}
