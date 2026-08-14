package com.tuan.learningservice.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Getter
@Setter
@Entity
@Table(name = "topics")
public class Topic {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @Size(max = 255)
    @NotNull
    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "description", length = Integer.MAX_VALUE)
    private String description;

    @Column(name = "url_image", length = Integer.MAX_VALUE)
    private String urlImage;

    @ColumnDefault("0.00")
    @Column(name = "progress", precision = 5, scale = 2)
    private BigDecimal progress;

    @Column(name = "color", length = Integer.MAX_VALUE)
    private String color;

    @ColumnDefault("false")
    @Column(name = "is_public")
    private Boolean isPublic;

    @Size(max = 100)
    @Column(name = "user_id", length = 100)
    private String userId;

    @Column(name = "create_at", insertable = false, updatable = false)
    private OffsetDateTime createAt;

    @Column(name = "update_at", insertable = false, updatable = false)
    private OffsetDateTime updateAt;


}