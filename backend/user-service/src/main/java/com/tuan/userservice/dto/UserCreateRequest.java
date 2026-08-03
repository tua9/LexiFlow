package com.tuan.userservice.dto;

public record UserCreateRequest(String username, String password, String level) {
}
