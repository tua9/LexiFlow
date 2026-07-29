package com.tuan.userservice.service;

import com.tuan.userservice.dto.UserUpdateRequest;
import lombok.RequiredArgsConstructor;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.resource.UserResource;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class KeycloakAdminService {

    @Value("${keycloak.realm}")
    private String realm;

    private final Keycloak keycloak;

    public void updateProfile(String userId, UserUpdateRequest request) {

        UserResource userResource = keycloak
                .realm(realm)
                .users()
                .get(userId);

        UserRepresentation user = userResource.toRepresentation();

        user.setFirstName(request.getFirstname());
        user.setLastName(request.getLastname());
        user.setEmail(request.getEmail());

        userResource.update(user);
    }

}
