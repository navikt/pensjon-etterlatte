package no.nav.etterlatte.mottak

import no.nav.etterlatte.libs.common.innsendtsoeknad.common.SoeknadType
import no.nav.etterlatte.libs.utils.database.singleOrNull
import no.nav.etterlatte.mapper
import no.nav.etterlatte.toJson
import soeknad.SoeknadID
import tools.jackson.module.kotlin.readValue
import java.sql.Connection
import java.sql.Types
import java.time.Instant

/** Fremdriften til én søknad i prosesseringsløpet. Inneholder bare interne referanser, ikke fnr eller søknadsinnhold. */
data class SoeknadMottak(
    val soeknadId: SoeknadID,
    val soeknadType: SoeknadType,
    val opprettet: Instant,
    val kontekst: Journalfoeringskontekst?,
    val journalpost: Journalpostreferanse?,
    val overlevering: Overleveringsresultat?,
    val fullfoert: Instant?,
)

/** Det Gjenny har avgjort om hvor søknaden skal journalføres. */
data class Journalfoeringskontekst(
    val ukjentBruker: Boolean,
    val sakId: Long?,
    val sakType: String,
    val tema: String,
    val journalfoerendeEnhet: String,
) {
    init {
        require(ukjentBruker || sakId != null) { "Journalføringskontekst for kjent bruker mangler sakId" }
    }
}

data class Journalpostreferanse(
    val journalpostId: String,
    val ferdigstilt: Boolean,
    val dokumentInfoIder: List<String>,
)

/** [oppgaveId] er null når Gjenny ikke skal ha overlevering, som for ukjent bruker (B4). */
data class Overleveringsresultat(
    val oppgaveId: String?,
)

class SoeknadMottakDao {
    fun opprett(
        c: Connection,
        soeknadId: SoeknadID,
        soeknadType: SoeknadType,
    ) {
        c
            .prepareStatement("INSERT INTO soeknad_mottak (soeknad_id, soeknad_type) VALUES (?, ?)")
            .use {
                it.setLong(1, soeknadId)
                it.setString(2, soeknadType.name)
                it.executeUpdate()
            }
    }

    fun hent(
        c: Connection,
        soeknadId: SoeknadID,
    ): SoeknadMottak? =
        c.prepareStatement("SELECT * FROM soeknad_mottak WHERE soeknad_id = ?").use {
            it.setLong(1, soeknadId)
            it.executeQuery().singleOrNull {
                SoeknadMottak(
                    soeknadId = getLong("soeknad_id"),
                    soeknadType = SoeknadType.valueOf(getString("soeknad_type")),
                    opprettet = getTimestamp("opprettet").toInstant(),
                    kontekst =
                        getTimestamp("kontekst_hentet")?.let {
                            Journalfoeringskontekst(
                                ukjentBruker = getBoolean("ukjent_bruker"),
                                sakId = getLong("sak_id").takeUnless { wasNull() },
                                sakType = getString("sak_type"),
                                tema = getString("tema"),
                                journalfoerendeEnhet = getString("journalfoerende_enhet"),
                            )
                        },
                    journalpost =
                        getTimestamp("journalfoert")?.let {
                            Journalpostreferanse(
                                journalpostId = getString("journalpost_id"),
                                ferdigstilt = getBoolean("journalpost_ferdigstilt"),
                                dokumentInfoIder = mapper.readValue(getString("dokument_info_ider")),
                            )
                        },
                    overlevering =
                        getTimestamp("overlevert")?.let { Overleveringsresultat(oppgaveId = getString("oppgave_id")) },
                    fullfoert = getTimestamp("fullfoert")?.toInstant(),
                )
            }
        }

    fun lagreKontekst(
        c: Connection,
        soeknadId: SoeknadID,
        kontekst: Journalfoeringskontekst,
    ) = oppdaterEn(
        c,
        """
        UPDATE soeknad_mottak
           SET ukjent_bruker = ?, sak_id = ?, sak_type = ?, tema = ?, journalfoerende_enhet = ?, kontekst_hentet = now()
         WHERE soeknad_id = ? AND kontekst_hentet IS NULL
        """.trimIndent(),
    ) {
        setBoolean(1, kontekst.ukjentBruker)
        if (kontekst.sakId == null) setNull(2, Types.BIGINT) else setLong(2, kontekst.sakId)
        setString(3, kontekst.sakType)
        setString(4, kontekst.tema)
        setString(5, kontekst.journalfoerendeEnhet)
        setLong(6, soeknadId)
    }

    fun lagreJournalpost(
        c: Connection,
        soeknadId: SoeknadID,
        journalpost: Journalpostreferanse,
    ) = oppdaterEn(
        c,
        """
        UPDATE soeknad_mottak
           SET journalpost_id = ?, journalpost_ferdigstilt = ?, dokument_info_ider = ?::jsonb, journalfoert = now()
         WHERE soeknad_id = ? AND kontekst_hentet IS NOT NULL AND journalfoert IS NULL
        """.trimIndent(),
    ) {
        setString(1, journalpost.journalpostId)
        setBoolean(2, journalpost.ferdigstilt)
        setString(3, journalpost.dokumentInfoIder.toJson())
        setLong(4, soeknadId)
    }

    fun lagreOverlevering(
        c: Connection,
        soeknadId: SoeknadID,
        resultat: Overleveringsresultat,
    ) = oppdaterEn(
        c,
        """
        UPDATE soeknad_mottak
           SET oppgave_id = ?, overlevert = now()
         WHERE soeknad_id = ? AND journalfoert IS NOT NULL AND overlevert IS NULL
        """.trimIndent(),
    ) {
        setString(1, resultat.oppgaveId)
        setLong(2, soeknadId)
    }

    fun markerFullfoert(
        c: Connection,
        soeknadId: SoeknadID,
    ) = oppdaterEn(
        c,
        "UPDATE soeknad_mottak SET fullfoert = now() WHERE soeknad_id = ? AND overlevert IS NOT NULL AND fullfoert IS NULL",
    ) { setLong(1, soeknadId) }

    private fun oppdaterEn(
        c: Connection,
        sql: String,
        parametre: java.sql.PreparedStatement.() -> Unit,
    ) {
        val antall =
            c.prepareStatement(sql).use {
                it.parametre()
                it.executeUpdate()
            }
        check(antall == 1) { "Mottaket er ikke i forventet tilstand (oppdaterte $antall rader)" }
    }
}