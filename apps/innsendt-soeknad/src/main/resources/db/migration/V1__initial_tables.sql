CREATE TABLE soeknad
(
    id             bigint               NOT NULL,
    fnr            VARCHAR(32)              NOT NULL,
    data           JSON                     NOT NULL,
    opprettet      TIMESTAMP WITH TIME ZONE NOT NULL default (now() at time zone 'UTC'),
    PRIMARY KEY (id)
);

CREATE TABLE hendelse
(
    id             bigint               NOT NULL,
    soeknad        bigint                NOT NULL,
    status         VARCHAR(16)              NOT NULL,
    data           JSON                     NOT NULL,
    opprettet      TIMESTAMP WITH TIME ZONE NOT NULL default (now() at time zone 'UTC'),
    PRIMARY KEY (id)
);

CREATE SEQUENCE soeknad_id;
CREATE SEQUENCE hendelse_id;
