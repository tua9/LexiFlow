CREATE TABLE user_permission
(
    user_id       BIGSERIAL   NOT NULL,
    permission_id BIGINT NOT NULL,

    PRIMARY KEY (user_id, permission_id),

    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (permission_id) REFERENCES permissions (id)
);

CREATE TABLE user_permission_denied
(
    user_id       BIGSERIAL   NOT NULL,
    permission_id BIGINT NOT NULL,

    PRIMARY KEY (user_id, permission_id),

    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (permission_id) REFERENCES permissions (id)
);