package com.tuan.userservice.dto;

import lombok.Data;

import java.time.OffsetDateTime;
import java.util.List;

@Data
public class UserResponse {
    private String userId;
    private String urlAvatar;
    private String firstname;
    private String lastname;
    private String email;
    private String level;
    private String role;
    private List<String> permission;
    private OffsetDateTime createAt;
    private OffsetDateTime updateAt;
}