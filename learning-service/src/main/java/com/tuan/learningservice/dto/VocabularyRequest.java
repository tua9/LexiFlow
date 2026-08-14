package com.tuan.learningservice.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class VocabularyRequest {

    @NotBlank(message = "Vocabulary word is required")
    @Size(max = 255, message = "Word must be less than 255 characters")
    private String word;

    @Size(max = 100, message = "Word type must be less than 100 characters")
    private String wordType;

    private String pronunciation;

    private String meaning;

    private String sampleSentence;

    @Size(max = 50, message = "Level must be less than 50 characters")
    private String level;

    private String urlImage;

    private String urlSound;

    private Long topicId;
}
