package com.tuan.userservice.service;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class CurrentUserService {

    @SuppressWarnings("unchecked")
    public Map<String, Object> getCurrentUser() {
        Jwt jwt = (Jwt) SecurityContextHolder.getContext()
                .getAuthentication()
                .getPrincipal();

        Map<String, Object> realmAccess = jwt.getClaim("realm_access");

        return Map.of(
                "userId", jwt.getSubject(),
                "firstName", jwt.getClaimAsString("family_name"),
                "lastName", jwt.getClaimAsString("given_name"),
                "email", jwt.getClaimAsString("email"),
                "username", jwt.getClaimAsString("preferred_username"),
                "roles", (List<String>) realmAccess.getOrDefault("roles", List.of())
        );
    }
}
