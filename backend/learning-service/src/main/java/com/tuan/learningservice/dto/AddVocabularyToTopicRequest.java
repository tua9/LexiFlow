package com.tuan.learningservice.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AddVocabularyToTopicRequest {

    @NotNull(message = "Vocabulary id is required")
    private Long vocabularyId;
}
