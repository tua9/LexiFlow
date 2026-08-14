package com.tuan.userservice.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.multipart.MultipartFile;

@FeignClient(name = "cloudinary-service")
public interface CloudinaryClient {
    @GetMapping("/cloudinary")
    String getDemo();

    @PostMapping(value = "/cloudinary/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    String postFile(@RequestPart("file") MultipartFile file);
}