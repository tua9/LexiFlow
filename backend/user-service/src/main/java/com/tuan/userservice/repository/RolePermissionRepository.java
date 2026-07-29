package com.tuan.userservice.repository;

import com.tuan.userservice.model.RolePermission;
import com.tuan.userservice.model.RolePermissionId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RolePermissionRepository extends JpaRepository<RolePermission, RolePermissionId> {
}
