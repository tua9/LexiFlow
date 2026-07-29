package com.tuan.cloudinaryservice.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
public class CloudinaryUploadService {

    private final Cloudinary cloudinary;

    public CloudinaryUploadService(Cloudinary cloudinary) {
        this.cloudinary = cloudinary;
    }

    public UploadResponse upload(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File must not be empty");
        }

        try {
            Map<?, ?> result = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap("resource_type", "auto"));
            String url = (String) result.get("secure_url");
            String publicId = (String) result.get("public_id");
            return new UploadResponse(url, publicId);
        } catch (IOException ex) {
            throw new IllegalStateException("Could not upload file to Cloudinary", ex);
        }
    }
}
