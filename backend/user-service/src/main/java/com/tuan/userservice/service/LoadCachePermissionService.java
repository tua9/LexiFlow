package com.tuan.userservice.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
public class LoadCachePermissionService {
    private final UserService userService;
    private final Map<String, Set<String>> cache = new ConcurrentHashMap<>();

    public Set<String> getUserPermission(String userId) {
        return cache.computeIfAbsent(userId, this::loadUserPermission);
    }

    public Set<String> loadUserPermission(String userId) {
        return userService.getPermission();
    }

    public void removeUserPermission(String userId) {
        cache.remove(userId);
        System.out.println("Remove " + userId);
    }
}
