package com.tuan.userservice.controller;

import com.tuan.userservice.service.RoleService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.repository.query.Param;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/roles")
@RequiredArgsConstructor
public class RoleController {
    private final RoleService roleService;

    @GetMapping
    public ResponseEntity<?> getRoles() {
        return ResponseEntity.ok(roleService.getRoles());
    }

    @PostMapping
    public ResponseEntity<?> createRole(@RequestParam("name") String name, @RequestParam("desc") String desc) {
        return ResponseEntity.ok(roleService.createRole(name, desc));
    }
}
