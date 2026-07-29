package com.tuan.userservice.repository;

import com.tuan.userservice.model.Permission;
import com.tuan.userservice.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PermissionRepository extends JpaRepository<Permission, Long> {
}
