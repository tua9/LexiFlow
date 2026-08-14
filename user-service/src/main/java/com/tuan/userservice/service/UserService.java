package com.tuan.userservice.service;

import com.tuan.userservice.client.CloudinaryClient;
import com.tuan.userservice.client.LearningClient;
import com.tuan.userservice.dto.UserCreateRequest;
import com.tuan.userservice.dto.UserResponse;
import com.tuan.userservice.dto.UserUpdateRequest;
import com.tuan.userservice.mapper.UserMapper;
import com.tuan.userservice.model.TopicResponse;
import com.tuan.userservice.model.User;
import com.tuan.userservice.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.representations.idm.RoleRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {
    @Value("${keycloak.realm}")
    private String realm;
    private final UserRepository userRepository;

    private final RoleService roleService;

    private final UserMapper userMapper;
    private final KeycloakAdminService keycloakAdminService;
    private final Keycloak keycloak;
    private final CloudinaryClient cloudinaryClient;
    private final LearningClient learningClient;

    private final Map<String, UserRepresentation> userCache = new ConcurrentHashMap<>();

    public List<UserResponse> getAll() {
        List<UserResponse> users = userRepository.findAll()
                .stream()
                .map(userMapper::toUserResponse)
                .toList();

        return users.stream()
                .map(this::enrichWithKeycloak)
                .toList();
    }

    @Transactional
    public UserResponse getUser(String userId) {
        UserRepresentation userKeycloak = getKeycloakUser(userId);
        try {
            User user = userRepository.findByUserId(userId).orElseThrow(() -> new RuntimeException("Cannot find user by id: " + userId));
            return mergeToUserResponse(user, userKeycloak);
        } catch (RuntimeException e) {
            System.out.println(e.getMessage());
            if (userKeycloak != null) {
                User newUser = new User();
                newUser.setUserId(userKeycloak.getId());
                newUser.setLevel("A1");
                userRepository.save(newUser);
                return mergeToUserResponse(newUser, userKeycloak);
            }
        }
        return null;
    }

    public List<TopicResponse> getUserTopics(String userId) {
        return learningClient.getUserTopics(userId);
    }

    @Transactional
    public UserResponse createUser(UserCreateRequest request) {
        String userId = keycloakAdminService.createUser(request);

        User user = new User();
        user.setUserId(userId);
        user.setLevel(request.level() != null ? request.level() : "A1");

        userRepository.save(user);
        userCache.remove(userId);

        return getUser(userId);
    }

    public UserResponse updateUser(String userId, UserUpdateRequest request, MultipartFile file) {
        System.out.println("[SER] Update user");
        User userUpdate = userRepository.findByUserId(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        if (file != null && !file.isEmpty()) {
            String uploadedUrl = cloudinaryClient.postFile(file);
            userUpdate.setUrlAvatar(uploadedUrl);
        }

        if(request != null) {
            if (request.getLevel() != null)
                userUpdate.setLevel(request.getLevel());
            updateKeycloakProfile(userId, request);
        }


        User updatedUser = userRepository.save(userUpdate);
        userCache.remove(updatedUser.getUserId());

        return getUser(updatedUser.getUserId());
    }

    private void updateKeycloakProfile(String userId, UserUpdateRequest request) {
        keycloakAdminService.updateProfile(userId, request);
    }

    public Set<String> getPermission() {
        return null;
    }

    @Transactional
    public Boolean deleteUser(String userId) {
        return userRepository.deleteByUserId(userId) > 0;
    }

    //Helper

    private UserResponse mergeToUserResponse(User user, UserRepresentation userKeycloak) {
        UserResponse userResponse = userMapper.toUserResponse(user);
        UserResponse resultGetUserKeycloak = enrichWithKeycloak(userResponse);
        if (resultGetUserKeycloak == null) return null;
        String roles = roleService.getUserRoles(user.getId());
        userResponse.setRole(roles);

        return userResponse;
    }

    private UserResponse enrichWithKeycloak(UserResponse userResponse) {
        try {
            UserRepresentation kcUser = getKeycloakUser(userResponse.getUserId());
            List<RoleRepresentation> realmRolesList = keycloak.realm(realm)
                    .users()
                    .get(userResponse.getUserId())
                    .roles()
                    .realmLevel()
                    .listAll();

            String roles = realmRolesList.stream()
                    .map(RoleRepresentation::getName)
                    .collect(Collectors.joining(" "));

            userResponse.setFirstname(kcUser.getFirstName());
            userResponse.setLastname(kcUser.getLastName());
            userResponse.setEmail(kcUser.getEmail());
            userResponse.setRole(roles);

            return userResponse;
        } catch (Exception e) {
            System.out.println(e.getStackTrace());
            return null;
        }
    }

    private UserRepresentation getKeycloakUser(String userId) {
        return userCache.computeIfAbsent(userId, id -> {
            try {
                return keycloak.realm(realm).users().get(id).toRepresentation();
            } catch (Exception e) {
                return new UserRepresentation(); // fallback rỗng
            }
        });
    }
}
