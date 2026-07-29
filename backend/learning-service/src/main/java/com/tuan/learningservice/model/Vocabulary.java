package com.tuan.learningservice.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.OffsetDateTime;

@Getter
@Setter
@Entity
@Table(name = "vocabularies")
public class Vocabulary {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @Size(max = 255)
    @NotNull
    @Column(name = "word", nullable = false)
    private String word;

    @Size(max = 100)
    @Column(name = "word_type", length = 100)
    private String wordType;

    @Size(max = 255)
    @Column(name = "pronunciation")
    private String pronunciation;

    @Column(name = "meaning", length = Integer.MAX_VALUE)
    private String meaning;

    @Column(name = "sample_sentence", length = Integer.MAX_VALUE)
    private String sampleSentence;

    @Size(max = 50)
    @Column(name = "level", length = 50)
    private String level;

    @Column(name = "url_image", length = Integer.MAX_VALUE)
    private String urlImage;

    @Column(name = "url_sound", length = Integer.MAX_VALUE)
    private String urlSound;

    @Column(name = "create_at", insertable = false, updatable = false)
    private OffsetDateTime createAt;

    @Column(name = "update_at", insertable = false, updatable = false)
    private OffsetDateTime updateAt;


}