package com.tuan.userservice.repository;

import com.tuan.userservice.model.UserRole;
import com.tuan.userservice.model.UserRoleId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRoleRepository extends JpaRepository<UserRole, UserRoleId> {
    @Modifying
    @Query(value = "SELECT * FROM user_roles ur WHERE ur.user_id = :userId", nativeQuery = true)
    List<UserRole> findUserRoleByUserId(@Param("userId") Long id);
}
