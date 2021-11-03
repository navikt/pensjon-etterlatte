CREATE TABLE soeknad
(
    id BIGSERIAL
        CONSTRAINT soeknad_pk
            PRIMARY KEY,
    fnr VARCHAR(32) NOT NULL,
    payload TEXT NOT NULL,
    opprettet TIMESTAMP WITH TIME ZONE DEFAULT (now() AT TIME ZONE 'UTC') NOT NULL
);

CREATE UNIQUE INDEX soeknad_fnr_uindex
    ON soeknad (fnr);


CREATE TABLE status
(
    id VARCHAR(16)
        CONSTRAINT status_pk
            PRIMARY KEY,
    rang INT NOT NULL
);

INSERT INTO status(id, rang) VALUES('LAGRETKLADD', 1);
INSERT INTO status(id, rang) VALUES('FERDIGSTILT', 2);
INSERT INTO status(id, rang) VALUES('SENDT', 3);
INSERT INTO status(id, rang) VALUES('ARKIVERT', 4);
INSERT INTO status(id, rang) VALUES('ARKIVERINGSFEIL', 5);
INSERT INTO status(id, rang) VALUES('SLETTET', 6);
INSERT INTO status(id, rang) VALUES('UTGAATT', 7);

CREATE TABLE hendelse
(
    id BIGSERIAL
        CONSTRAINT hendelse_pk
            PRIMARY KEY,
    soeknad_id BIGINT NOT NULL,
    status_id VARCHAR(16) NOT NULL
        CONSTRAINT hendelse_status_id_fk
            REFERENCES status (id),
    payload TEXT NOT NULL,
    opprettet TIMESTAMP WITH TIME ZONE DEFAULT (now() AT TIME ZONE 'UTC') NOT NULL
);
