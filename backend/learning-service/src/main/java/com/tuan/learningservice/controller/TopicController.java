package com.tuan.learningservice.controller;

import com.tuan.learningservice.dto.AddVocabularyToTopicRequest;
import com.tuan.learningservice.dto.CopyTopicRequest;
import com.tuan.learningservice.dto.TopicRequest;
import com.tuan.learningservice.dto.TopicResponse;
import com.tuan.learningservice.dto.VocabularyResponse;
import com.tuan.learningservice.service.TopicService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/topics")
@RequiredArgsConstructor
public class TopicController {

    private final TopicService topicService;

    @GetMapping
    public List<TopicResponse> findAll() {
        return topicService.findAll();
    }

    @GetMapping("/public")
    public List<TopicResponse> findPublicTopics() {
        return topicService.findPublicTopics();
    }

    @GetMapping("/{id}")
    public TopicResponse findById(@PathVariable String id) {
        Long convertedId = Long.parseLong(id);
        return topicService.findById(convertedId);
    }

    @GetMapping("/user/{userId}")
    public List<TopicResponse> findByUserId(@PathVariable String userId) {
        return topicService.findByUserId(userId);
    }

    @GetMapping("/{id}/vocabularies")
    public List<VocabularyResponse> findVocabulariesByTopicId(@PathVariable Long id) {
        return topicService.findVocabulariesByTopicId(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TopicResponse create(@Valid @RequestBody TopicRequest request) {
        return topicService.create(request);
    }

    @PutMapping("/{id}")
    public TopicResponse update(@PathVariable Long id, @Valid @RequestBody TopicRequest request) {
        return topicService.update(id, request);
    }

    @PostMapping("/{id}/duplicate")
    @ResponseStatus(HttpStatus.CREATED)
    public TopicResponse copyTopic(@PathVariable Long id, @RequestBody(required = false) CopyTopicRequest request) {
        return topicService.copyTopic(id, request);
    }

    @PostMapping("/{id}/vocabularies")
    @ResponseStatus(HttpStatus.CREATED)
    public void addVocabularyToTopic(@PathVariable Long id, @Valid @RequestBody AddVocabularyToTopicRequest request) {
        topicService.addVocabularyToTopic(id, request.getVocabularyId());
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        topicService.delete(id);
    }
}
