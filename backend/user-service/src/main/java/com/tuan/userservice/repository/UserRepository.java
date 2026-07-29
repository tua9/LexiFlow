package com.tuan.userservice.repository;

import com.tuan.userservice.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUserId(String userId);

    @Modifying
    @Query(value = "DELETE FROM User u WHERE u.userId = :userId")
    int deleteByUserId(@Param("userId") String userId);
}
