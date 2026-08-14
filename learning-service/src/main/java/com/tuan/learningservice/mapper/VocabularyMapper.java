package com.tuan.learningservice.mapper;

import com.tuan.learningservice.dto.VocabularyRequest;
import com.tuan.learningservice.dto.VocabularyResponse;
import com.tuan.learningservice.model.Vocabulary;

public final class VocabularyMapper {

    private VocabularyMapper() {
    }

    public static Vocabulary toEntity(VocabularyRequest request) {
        Vocabulary vocabulary = new Vocabulary();
        vocabulary.setWord(request.getWord());
        vocabulary.setWordType(request.getWordType());
        vocabulary.setPronunciation(request.getPronunciation());
        vocabulary.setMeaning(request.getMeaning());
        vocabulary.setSampleSentence(request.getSampleSentence());
        vocabulary.setLevel(request.getLevel());
        vocabulary.setUrlImage(request.getUrlImage());
        vocabulary.setUrlSound(request.getUrlSound());
        return vocabulary;
    }

    public static void updateEntity(Vocabulary vocabulary, VocabularyRequest request) {
        vocabulary.setWord(request.getWord());
        vocabulary.setWordType(request.getWordType());
        vocabulary.setPronunciation(request.getPronunciation());
        vocabulary.setMeaning(request.getMeaning());
        vocabulary.setSampleSentence(request.getSampleSentence());
        vocabulary.setLevel(request.getLevel());
        vocabulary.setUrlImage(request.getUrlImage());
        vocabulary.setUrlSound(request.getUrlSound());
    }

    public static VocabularyResponse toResponse(Vocabulary vocabulary) {
        return new VocabularyResponse(
                vocabulary.getId(),
                vocabulary.getWord(),
                vocabulary.getWordType(),
                vocabulary.getPronunciation(),
                vocabulary.getMeaning(),
                vocabulary.getSampleSentence(),
                vocabulary.getLevel(),
                vocabulary.getUrlImage(),
                vocabulary.getUrlSound(),
                null,
                vocabulary.getCreateAt(),
                vocabulary.getUpdateAt()
        );
    }
}
