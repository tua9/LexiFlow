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
public class UserPermissionId implements Serializable {
    private static final long serialVersionUID = 7617461311625996939L;
    @NotNull
    @ColumnDefault("nextval('user_permission_user_id_seq')")
    @Column(name = "user_id", nullable = false)
    private Long userId;

    @NotNull
    @Column(name = "permission_id", nullable = false)
    private Long permissionId;


}