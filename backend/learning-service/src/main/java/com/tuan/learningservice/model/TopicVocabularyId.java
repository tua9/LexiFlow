package com.tuan.learningservice.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.validation.constraints.NotNull;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;

@Getter
@Setter
@EqualsAndHashCode
@Embeddable
public class TopicVocabularyId implements Serializable {
    private static final long serialVersionUID = -1246900484549789150L;
    @NotNull
    @Column(name = "topic_id", nullable = false)
    private Long topicId;

    @NotNull
    @Column(name = "vocabulary_id", nullable = false)
    private Long vocabularyId;


}