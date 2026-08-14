package com.tuan.learningservice.mapper;

import com.tuan.learningservice.dto.TopicRequest;
import com.tuan.learningservice.dto.TopicResponse;
import com.tuan.learningservice.model.Topic;

public final class TopicMapper {

    private TopicMapper() {
    }

    public static Topic toEntity(TopicRequest request) {
        Topic topic = new Topic();
        topic.setName(request.getName());
        topic.setDescription(request.getDescription());
        topic.setUrlImage(request.getUrlImage());
        topic.setProgress(request.getProgress());
        topic.setColor(request.getColor());
        topic.setIsPublic(request.getIsPublic() != null ? request.getIsPublic() : Boolean.FALSE);
        topic.setUserId(request.getUserId());
        return topic;
    }

    public static void updateEntity(Topic topic, TopicRequest request) {
        topic.setName(request.getName());
        topic.setDescription(request.getDescription());
        topic.setUrlImage(request.getUrlImage());
        topic.setProgress(request.getProgress());
        topic.setColor(request.getColor());
        topic.setIsPublic(request.getIsPublic() != null ? request.getIsPublic() : topic.getIsPublic());
    }

    public static TopicResponse toResponse(Topic topic) {
        return new TopicResponse(
                topic.getId(),
                topic.getName(),
                topic.getDescription(),
                topic.getUrlImage(),
                topic.getProgress(),
                topic.getColor(),
                topic.getIsPublic(),
                topic.getUserId(),
                topic.getCreateAt(),
                topic.getUpdateAt()
        );
    }
}
