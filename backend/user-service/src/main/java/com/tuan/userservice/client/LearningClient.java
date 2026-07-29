package com.tuan.userservice.client;

import com.tuan.userservice.model.TopicResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@FeignClient(name = "learning-service")
public interface LearningClient {
    @GetMapping("/api/v1/topics/{id}")
    Object getTopicById(@PathVariable String id);

    @GetMapping("/api/v1/topics/user/{userId}")
    List<TopicResponse> getUserTopics(@PathVariable String userId);
}