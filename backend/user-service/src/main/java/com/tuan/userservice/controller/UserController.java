package com.tuan.userservice.controller;

import com.tuan.userservice.dto.UserCreateRequest;
import com.tuan.userservice.dto.UserResponse;
import com.tuan.userservice.dto.UserUpdateRequest;
import com.tuan.userservice.model.TopicResponse;
import com.tuan.userservice.service.CurrentUserService;
import com.tuan.userservice.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final CurrentUserService currentUserService;

    @GetMapping
    public ResponseEntity<List<UserResponse>> getUsers() {
        System.out.println("Get all users");
        return ResponseEntity.ok(userService.getAll());
    }

    @GetMapping("/{userId}")
    public ResponseEntity<UserResponse> getUser(@PathVariable String userId) {
        return ResponseEntity.ok(userService.getUser(userId));
    }

    @GetMapping("/{userId}/topics")
    public ResponseEntity<List<TopicResponse>> getUesrTopics(@PathVariable String userId) {
        return ResponseEntity.ok(userService.getUserTopics(userId));
    }

    @PutMapping(value = "/{userId}")
    public ResponseEntity<UserResponse> updateUser(
            @RequestPart(value = "data", required = false) UserUpdateRequest request,   // Spring tự parse JSON
            @RequestPart(value = "file", required = false) MultipartFile file,
            @PathVariable String userId) {
        System.out.println("[CTL] Update user");

        return ResponseEntity.ok(userService.updateUser(userId, request, file));
    }

//    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
//    public ResponseEntity<UserResponse> createUser(
//            @RequestPart("data") CreateUserRequest request,
//            @RequestPart(value = "file", required = false) MultipartFile file) {
//        return ResponseEntity.status(HttpStatus.CREATED).body(userService.createUser(request, file));
//    }

    @PostMapping
    public ResponseEntity<UserResponse> createUser(@RequestBody UserCreateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(userService.createUser(request));
    }

    @DeleteMapping("{userId}")
    public Boolean deleteUser(@PathVariable String userId) {
        return userService.deleteUser(userId);
    }
}

