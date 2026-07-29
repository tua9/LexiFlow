package com.tuan.learningservice.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
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
