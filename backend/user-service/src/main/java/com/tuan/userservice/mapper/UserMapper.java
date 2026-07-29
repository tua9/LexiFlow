package com.tuan.userservice.mapper;

import com.tuan.userservice.dto.UserResponse;
import com.tuan.userservice.model.User;
import org.keycloak.representations.idm.UserRepresentation;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;
import org.springframework.stereotype.Component;

import java.util.List;


@Mapper(
        componentModel = "spring",
        unmappedTargetPolicy = ReportingPolicy.IGNORE,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE
)
public interface UserMapper {
    UserResponse toUserResponse(User user);

    @Mapping(target = "firstname", source = "userRepresentation.firstName")
    @Mapping(target = "lastname", source = "userRepresentation.lastName")
    UserResponse toUserResponse(UserRepresentation userRepresentation);

    List<UserResponse> toListUserResponse(List<User> users);
}
