package com.tuan.userservice.service;

import com.tuan.userservice.model.Role;
import com.tuan.userservice.model.UserRole;
import com.tuan.userservice.repository.RoleRepository;
import com.tuan.userservice.repository.UserRoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import javax.annotation.processing.RoundEnvironment;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RoleService {
    private final UserRoleRepository userRoleRepository;
    private final RoleRepository roleRepository;

    public List<Role> getRoles() {
        return roleRepository.findAll();
    }

    public String getUserRoles(Long id) {
        List<UserRole> listUserRole = userRoleRepository.findUserRoleByUserId(id);
        return listUserRole.stream().map(ur -> ur.getRole().getName()).collect(Collectors.joining(" "));
    }

    public Role createRole(String name, String desc) {
        Role newRole = new Role();
        newRole.setName(name);
        newRole.setDescription(desc);
        roleRepository.saveAndFlush(newRole);
        return newRole;
    }
}
