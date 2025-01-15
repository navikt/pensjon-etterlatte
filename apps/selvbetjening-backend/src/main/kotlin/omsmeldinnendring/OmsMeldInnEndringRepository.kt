package no.nav.etterlatte.omsendringer

import no.nav.etterlatte.libs.common.person.Foedselsnummer
import no.nav.etterlatte.libs.utils.database.firstOrNull
import no.nav.etterlatte.libs.utils.database.toList
import no.nav.etterlatte.omsendringer.Queries.HENT_ENDRING
import no.nav.etterlatte.omsendringer.Queries.HENT_ENDRING_MED_STATUS
import no.nav.etterlatte.omsendringer.Queries.LAGRE_ENDRINGER
import no.nav.etterlatte.omsendringer.Queries.OPPDATER_STATUS
import java.sql.ResultSet
import java.sql.Timestamp
import java.util.UUID
import javax.sql.DataSource

class OmsMeldInnEndringRepository(
    val ds: DataSource,
) {
    private val connection get() = ds.connection

    fun hentEndring(id: UUID) =
        connection.use {
            it
                .prepareStatement(HENT_ENDRING)
                .apply {
                    setObject(1, id)
                }.executeQuery()
                .firstOrNull {
                    OmsMeldtInnEndring(
                        id = UUID.fromString(getString("id")),
                        fnr = Foedselsnummer.of(getString("fnr")),
                        endring = OmsEndring.valueOf(getString("type")),
                        beskrivelse = getString("endringer"),
                        tidspunkt = getTimestamp("tidspunkt").toInstant(),
                    )
                }
        }

    fun lagreEndringer(endringer: OmsMeldtInnEndring) =
        connection.use {
            it
                .prepareStatement(LAGRE_ENDRINGER)
                .apply {
                    setObject(1, endringer.id)
                    setString(2, endringer.fnr.value)
                    setString(3, endringer.endring.name)
                    setString(4, endringer.beskrivelse)
                    setString(5, OmsMeldtInnEndringStatus.LAGRET.name)
                    setTimestamp(6, Timestamp.from(endringer.tidspunkt))
                }.execute()
        }

    fun hentEndringerMedStatus(status: OmsMeldtInnEndringStatus) =
        connection.use {
            it
                .prepareStatement(HENT_ENDRING_MED_STATUS)
                .apply {
                    setString(1, status.name)
                }.executeQuery()
                .toList { this.toOmsMeldtInnEndring() }
        }

    fun oppdaterStatusForId(
        id: UUID,
        status: OmsMeldtInnEndringStatus,
    ) = connection.use {
        it
            .prepareStatement(OPPDATER_STATUS)
            .apply {
                setString(1, status.name)
                setObject(2, id)
            }.execute()
    }
}

private fun ResultSet.toOmsMeldtInnEndring() =
    OmsMeldtInnEndring(
        id = UUID.fromString(getString("id")),
        fnr = Foedselsnummer.of(getString("fnr")),
        endring = OmsEndring.valueOf(getString("type")),
        beskrivelse = getString("endringer"),
        tidspunkt = getTimestamp("tidspunkt").toInstant(),
    )

private object Queries {
    val HENT_ENDRING =
        """
        SELECT * FROM oms_meld_inn_endring WHERE id = ?
        """.trimIndent()

    val LAGRE_ENDRINGER =
        """
        INSERT INTO oms_meld_inn_endring (id, fnr, type, endringer, status, tidspunkt) values (?,?,?,?,?,?)
        """.trimIndent()

    val HENT_ENDRING_MED_STATUS =
        """
        SELECT * FROM oms_meld_inn_endring WHERE status = ?
        """.trimIndent()

    val OPPDATER_STATUS =
        """
        UPDATE oms_meld_inn_endring SET status = ? WHERE id = ?
        """.trimIndent()
}