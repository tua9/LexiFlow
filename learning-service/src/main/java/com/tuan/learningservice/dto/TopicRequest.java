package com.tuan.learningservice.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TopicRequest {

    @NotBlank(message = "Topic name is required")
    @Size(max = 255, message = "Topic name must be less than 255 characters")
    private String name;

    private String description;

    private String urlImage;

    private BigDecimal progress;

    private String color;

    private Boolean isPublic;

    private String userId;
}
