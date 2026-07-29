alter table topics
alter column user_id type varchar(100);

create table user_topic (
    user_id varchar(100),
    topic_id BIGSERIAL,

    PRIMARY KEY (user_id, topic_id),

    create_at   TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    update_at   TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);