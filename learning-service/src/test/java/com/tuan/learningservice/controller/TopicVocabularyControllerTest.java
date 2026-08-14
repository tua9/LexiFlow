package com.tuan.learningservice.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tuan.learningservice.config.SecurityConfig;
import com.tuan.learningservice.dto.TopicRequest;
import com.tuan.learningservice.dto.TopicResponse;
import com.tuan.learningservice.dto.VocabularyRequest;
import com.tuan.learningservice.dto.VocabularyResponse;
import com.tuan.learningservice.service.TopicService;
import com.tuan.learningservice.service.VocabularyService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = {TopicController.class, VocabularyController.class})
@AutoConfigureMockMvc(addFilters = false)
@Import(SecurityConfig.class)
class TopicVocabularyControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private TopicService topicService;

    @MockBean
    private VocabularyService vocabularyService;

    @Test
    void shouldListTopics() throws Exception {
        when(topicService.findAll()).thenReturn(List.of(
                new TopicResponse(1L, "English", "Basic english", null, BigDecimal.valueOf(0.00), "#3498db", true, "user-1", OffsetDateTime.now(), OffsetDateTime.now())
        ));

        mockMvc.perform(get("/api/v1/topics"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("English"));
    }

    @Test
    void shouldCreateVocabulary() throws Exception {
        VocabularyRequest request = new VocabularyRequest("hello", "noun", "həˈloʊ", "greeting", "Hello world", "A1", null, null, 1L);
        when(vocabularyService.create(any(VocabularyRequest.class))).thenReturn(
                new VocabularyResponse(1L, "hello", "noun", "həˈloʊ", "greeting", "Hello world", "A1", null, null, 1L, OffsetDateTime.now(), OffsetDateTime.now())
        );

        mockMvc.perform(post("/api/v1/vocabularies")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.word").value("hello"));
    }
}
