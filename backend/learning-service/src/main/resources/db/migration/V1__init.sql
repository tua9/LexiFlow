CREATE TABLE topics
(
    id          BIGSERIAL PRIMARY KEY,
    name        VARCHAR(255) NOT NULL,
    description TEXT,
    url_image   TEXT,
    progress    NUMERIC(5, 2)            DEFAULT 0.00,
    color       TEXT,
    is_public   BOOLEAN                  DEFAULT FALSE,
    user_id     UUID,

    create_at   TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    update_at   TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE vocabularies
(
    id              BIGSERIAL PRIMARY KEY,
    word            VARCHAR(255) NOT NULL,
    word_type       VARCHAR(100),
    pronunciation   VARCHAR(255),
    meaning         TEXT,
    sample_sentence TEXT,
    level           VARCHAR(50),
    url_image       TEXT,
    url_sound       TEXT,
    topic_id        BIGINT,

    create_at       TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    update_at       TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_vocabulary_topic
        FOREIGN KEY (topic_id)
            REFERENCES topics (id)
            ON DELETE CASCADE
);

CREATE TABLE topic_vocabularies
(
    topic_id      BIGINT NOT NULL,
    vocabulary_id BIGINT NOT NULL,

    PRIMARY KEY (topic_id, vocabulary_id),

    CONSTRAINT fk_tv_topic
        FOREIGN KEY (topic_id)
            REFERENCES topics (id)
            ON DELETE CASCADE,

    CONSTRAINT fk_tv_vocabulary
        FOREIGN KEY (vocabulary_id)
            REFERENCES vocabularies (id)
            ON DELETE CASCADE
);

CREATE INDEX idx_tv_topic_id
    ON topic_vocabularies (topic_id);

CREATE INDEX idx_tv_vocabulary_id
    ON topic_vocabularies (vocabulary_id);