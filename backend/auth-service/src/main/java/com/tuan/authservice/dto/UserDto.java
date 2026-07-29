package com.tuan.authservice.dto;

import lombok.Data;

@Data
public class UserDto {
    private String username;
    private String email;
    private String firstName;
    private String lastName;
    // Có thể thêm role nếu cần
}
