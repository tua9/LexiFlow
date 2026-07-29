package com.tuan.cloudinaryservice.controller;

import com.tuan.cloudinaryservice.service.CloudinaryUploadService;
import com.tuan.cloudinaryservice.service.UploadResponse;
import jakarta.validation.constraints.NotNull;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/cloudinary")
@Validated
public class CloudinaryUploadController {

    private final CloudinaryUploadService uploadService;

    public CloudinaryUploadController(CloudinaryUploadService uploadService) {
        this.uploadService = uploadService;
    }

    @GetMapping
    public String testGet() {
        return "Get cloudinary";
    }

    @PostMapping(value = "/upload", consumes = org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadFile(@RequestParam(value = "file", required = false) MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Vui lòng đính kèm file hợp lệ dạng form-data"));
        }
        UploadResponse response = uploadService.upload(file);
        return ResponseEntity.ok(response.url());
    }

    @PutMapping String testPut() {
        throw new RuntimeException("Cloudinary thorw PUT exception");
    }
}
