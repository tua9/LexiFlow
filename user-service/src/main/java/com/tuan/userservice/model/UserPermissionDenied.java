package com.tuan.userservice.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

@Getter
@Setter
@Entity
@Table(name = "user_permission_denied")
public class UserPermissionDenied {
    @EmbeddedId
    private UserPermissionDeniedId id;

    @MapsId("userId")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @ColumnDefault("nextval('user_permission_denied_user_id_seq')")
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @MapsId("permissionId")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "permission_id", nullable = false)
    private Permission permission;


}