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
    id SERIAL
        CONSTRAINT status_pk
            PRIMARY KEY,
    navn VARCHAR(16) NOT NULL,
    rang INT NOT NULL
);

INSERT INTO status(id, navn, rang) VALUES(1, 'LAGRETKLADD', 1);
INSERT INTO status(id, navn, rang) VALUES(2, 'FERDIGSTILT', 2);
INSERT INTO status(id, navn, rang) VALUES(3, 'SENDT', 3);
INSERT INTO status(id, navn, rang) VALUES(4, 'ARKIVERT', 4);
INSERT INTO status(id, navn, rang) VALUES(5, 'ARKIVERINGSFEIL', 5);

CREATE TABLE hendelse
(
    id BIGSERIAL
        CONSTRAINT hendelse_pk
            PRIMARY KEY,
    soeknad_id BIGINT NOT NULL
        CONSTRAINT hendelse_soeknad_id_fk
            REFERENCES soeknad ON DELETE cascade,
    status_id INT NOT NULL
        CONSTRAINT hendelse_status_id_fk
            REFERENCES status,
    payload TEXT NOT NULL,
    opprettet TIMESTAMP WITH TIME ZONE DEFAULT (now() AT TIME ZONE 'UTC') NOT NULL
);