package com.tuan.userservice.model;

import lombok.Data;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Data
public class TopicResponse {
    private Long id;
    private String name;
    private String description;
    private String urlImage;
    private BigDecimal progress;
    private String color;
    private Boolean isPublic;
    private String userId;
    private OffsetDateTime createAt;
    private OffsetDateTime updateAt;
}
