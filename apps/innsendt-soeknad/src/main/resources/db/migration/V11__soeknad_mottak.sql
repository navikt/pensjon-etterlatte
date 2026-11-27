-- Varig valg av mottaksflyt per søknad. NULL betyr søknad ferdigstilt før valget fantes, og hører til Kafka-løpet.
ALTER TABLE soeknad
    ADD COLUMN mottaksflyt TEXT DEFAULT NULL
        CONSTRAINT soeknad_mottaksflyt_gyldig CHECK (mottaksflyt IN ('KAFKA', 'PROSESSERING'));

CREATE FUNCTION hindre_endret_mottaksflyt() RETURNS trigger AS
$$
BEGIN
    IF OLD.mottaksflyt IS NOT NULL AND NEW.mottaksflyt IS DISTINCT FROM OLD.mottaksflyt THEN
        RAISE EXCEPTION 'Mottaksflyt for søknad % kan ikke endres', OLD.id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER soeknad_mottaksflyt_uendret
    BEFORE UPDATE OF mottaksflyt ON soeknad
    FOR EACH ROW
EXECUTE FUNCTION hindre_endret_mottaksflyt();

-- Fremdrift for søknader i prosesseringsløpet. Søknadsinnholdet ligger fortsatt i innhold.
-- Tabellen har ingen fødselsnummer eller søknadsinnhold, bare interne referanser.
CREATE TABLE soeknad_mottak (
    soeknad_id              BIGINT      NOT NULL PRIMARY KEY REFERENCES soeknad (id),
    soeknad_type            TEXT        NOT NULL,
    opprettet               TIMESTAMPTZ NOT NULL DEFAULT now(),
    ukjent_bruker           BOOLEAN,
    sak_id                  BIGINT,
    sak_type                TEXT,
    tema                    TEXT,
    journalfoerende_enhet   TEXT,
    kontekst_hentet         TIMESTAMPTZ,
    journalpost_id          TEXT,
    journalpost_ferdigstilt BOOLEAN,
    dokument_info_ider      JSONB,
    journalfoert            TIMESTAMPTZ,
    oppgave_id              TEXT,
    overlevert              TIMESTAMPTZ,
    fullfoert               TIMESTAMPTZ
);
