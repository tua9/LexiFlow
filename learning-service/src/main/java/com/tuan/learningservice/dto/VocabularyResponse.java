package com.tuan.learningservice.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.OffsetDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class VocabularyResponse {
    private Long id;
    private String word;
    private String wordType;
    private String pronunciation;
    private String meaning;
    private String sampleSentence;
    private String level;
    private String urlImage;
    private String urlSound;
    private Long topicId;
    private OffsetDateTime createAt;
    private OffsetDateTime updateAt;
}
