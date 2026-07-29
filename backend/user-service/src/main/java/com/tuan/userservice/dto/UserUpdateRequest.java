package com.tuan.userservice.dto;

import lombok.Data;

@Data
public class UserUpdateRequest {
    private String firstname;
    private String lastname;
    private String email;
    private String level;
}
