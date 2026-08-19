CREATE TABLE daily_task_groups
(
    id          BIGSERIAL PRIMARY KEY,
    user_id     VARCHAR(100) NOT NULL,
    title       VARCHAR(255) NOT NULL,
    description TEXT,
    created_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tasks
(
    id          BIGSERIAL PRIMARY KEY,
    group_id    BIGINT NOT NULL,
    name        VARCHAR(255) NOT NULL,
    order_index INTEGER NOT NULL CHECK (order_index >= 0),
    created_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_tasks_group FOREIGN KEY (group_id)
        REFERENCES daily_task_groups (id) ON DELETE CASCADE
);

CREATE TABLE task_logs
(
    id           BIGSERIAL PRIMARY KEY,
    task_id      BIGINT NOT NULL,
    date         DATE NOT NULL,
    is_completed BOOLEAN NOT NULL,
    created_at   TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at   TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_task_logs_task FOREIGN KEY (task_id)
        REFERENCES tasks (id) ON DELETE CASCADE,
    CONSTRAINT uk_task_logs_task_date UNIQUE (task_id, date)
);

CREATE INDEX idx_daily_task_groups_user_id ON daily_task_groups (user_id);
CREATE INDEX idx_tasks_group_id ON tasks (group_id);
CREATE INDEX idx_task_logs_task_date ON task_logs (task_id, date);