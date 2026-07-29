package com.tuan.userservice.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.validation.constraints.NotNull;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

import java.io.Serializable;

@Getter
@Setter
@EqualsAndHashCode
@Embeddable
public class UserPermissionDeniedId implements Serializable {
    private static final long serialVersionUID = -4864106700766721712L;
    @NotNull
    @ColumnDefault("nextval('user_permission_denied_user_id_seq')")
    @Column(name = "user_id", nullable = false)
    private Long userId;

    @NotNull
    @Column(name = "permission_id", nullable = false)
    private Long permissionId;


}