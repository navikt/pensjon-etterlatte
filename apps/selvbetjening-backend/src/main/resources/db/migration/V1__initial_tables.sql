CREATE TABLE inntektsjustering
(
    id                     uuid                                                        NOT NULL,
    fnr                    TEXT                                                        NOT NULL,
    innsendt               TIMESTAMP WITH TIME ZONE DEFAULT (now() AT TIME ZONE 'UTC') NOT NULL,
    arbeidsinntekt         BIGINT                                                      NOT NULL,
    naeringsinntekt        BIGINT                                                      NOT NULL,
    arbeidsinntekt_utland  BIGINT                                                      NOT NULL,
    naeringsinntekt_utland BIGINT                                                      NOT NULL
);