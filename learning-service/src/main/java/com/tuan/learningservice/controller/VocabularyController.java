package com.tuan.learningservice.controller;

import com.tuan.learningservice.dto.VocabularyRequest;
import com.tuan.learningservice.dto.VocabularyResponse;
import com.tuan.learningservice.service.VocabularyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/vocabularies")
@RequiredArgsConstructor
public class VocabularyController {

    private final VocabularyService vocabularyService;

    @GetMapping
    public List<VocabularyResponse> findAll(@RequestParam(required = false) Long topicId) {
        if (topicId != null) {
            return vocabularyService.findByTopicId(topicId);
        }
        return vocabularyService.findAll();
    }

    @GetMapping("/{id}")
    public VocabularyResponse findById(@PathVariable Long id) {
        return vocabularyService.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public VocabularyResponse create(@Valid @RequestBody VocabularyRequest request) {
        return vocabularyService.create(request);
    }

    @PutMapping("/{id}")
    public VocabularyResponse update(@PathVariable Long id, @Valid @RequestBody VocabularyRequest request) {
        return vocabularyService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        vocabularyService.delete(id);
    }
}
