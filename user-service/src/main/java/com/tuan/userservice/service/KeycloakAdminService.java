package com.tuan.userservice.service;

import com.tuan.userservice.dto.UserCreateRequest;
import com.tuan.userservice.dto.UserUpdateRequest;
import lombok.RequiredArgsConstructor;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.resource.UserResource;
import org.keycloak.representations.idm.CredentialRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class KeycloakAdminService {

    @Value("${keycloak.realm}")
    private String realm;

    private final Keycloak keycloak;

    public String createUser(UserCreateRequest request) {
        CredentialRepresentation credential = new CredentialRepresentation();
        credential.setTemporary(false);
        credential.setType(CredentialRepresentation.PASSWORD);
        credential.setValue(request.password());

        UserRepresentation user = new UserRepresentation();
        user.setUsername(request.username());
        user.setEnabled(true);
        user.setFirstName(request.username());
        user.setLastName("User");
        user.setEmail(request.username() + "@example.com");
        user.setCredentials(List.of(credential));

        var response = keycloak.realm(realm).users().create(user);

        if (response.getStatus() != HttpStatus.CREATED.value()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Failed to create Keycloak user");
        }

        if (response.getLocation() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Keycloak did not return created user id");
        }

        String path = response.getLocation().getPath();
        return path.substring(path.lastIndexOf('/') + 1);
    }

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
