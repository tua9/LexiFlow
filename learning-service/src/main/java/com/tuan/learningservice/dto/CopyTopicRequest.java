package com.tuan.learningservice.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CopyTopicRequest {
    private Boolean isPublic;
    private String userId;
}
