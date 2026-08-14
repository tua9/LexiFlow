package com.tuan.userservice.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.OffsetDateTime;

@Data
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @Size(max = 255)
    @NotNull
    @Column(name = "user_id", nullable = false)
    private String userId;

    @Column(name = "url_avatar", length = Integer.MAX_VALUE)
    private String urlAvatar;

    @Size(max = 50)
    @Column(name = "level", length = 50)
    private String level;

    @Column(name = "create_at", insertable = false, updatable = false)
    private OffsetDateTime createAt;

    @Column(name = "update_at")
    @UpdateTimestamp
    private OffsetDateTime updateAt;
}