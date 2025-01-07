CREATE TABLE oms_meld_inn_endring
(
    id        uuid      NOT NULL,
    fnr       TEXT      NOT NULL,
    type      TEXT      NOT NULL,
    endringer TEXT      NOT NULL,
    tidspunkt TIMESTAMP NOT NULL
);