package no.nav.etterlatte.omsendringer

import com.fasterxml.jackson.module.kotlin.readValue
import no.nav.etterlatte.common.objectMapper
import no.nav.etterlatte.libs.common.omsmeldinnendring.ForventetInntektTilNesteAar
import no.nav.etterlatte.libs.common.omsmeldinnendring.OmsEndring
import no.nav.etterlatte.libs.common.omsmeldinnendring.OmsMeldtInnEndring
import no.nav.etterlatte.libs.common.omsmeldinnendring.OmsMeldtInnEndringStatus
import no.nav.etterlatte.libs.common.person.Foedselsnummer
import no.nav.etterlatte.libs.utils.database.firstOrNull
import no.nav.etterlatte.libs.utils.database.toList
import no.nav.etterlatte.omsendringer.Queries.HENT_ENDRING
import no.nav.etterlatte.omsendringer.Queries.HENT_ENDRING_MED_STATUS
import no.nav.etterlatte.omsendringer.Queries.LAGRE_ENDRINGER
import no.nav.etterlatte.omsendringer.Queries.OPPDATER_STATUS
import no.nav.etterlatte.toJson
import org.postgresql.util.PGobject
import java.sql.PreparedStatement
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
                        endring = OmsEndring.valueOf(getString("endring")),
                        beskrivelse = getString("beskrivelse"),
                        tidspunkt = getTimestamp("tidspunkt").toInstant(),
                        forventetInntektTilNesteAar =
                            getString(
                                "forventet_inntekt_til_neste_aar",
                            )?.let { objectMapper.readValue<ForventetInntektTilNesteAar?>(it) },
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
                    setJsonb(7, endringer.forventetInntektTilNesteAar?.toJson())
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
        endring = OmsEndring.valueOf(getString("endring")),
        beskrivelse = getString("beskrivelse"),
        tidspunkt = getTimestamp("tidspunkt").toInstant(),
        forventetInntektTilNesteAar =
            getString(
                "forventet_inntekt_til_neste_aar",
            )?.let { objectMapper.readValue<ForventetInntektTilNesteAar?>(it) },
    )

private object Queries {
    val HENT_ENDRING =
        """
        SELECT * FROM oms_meld_inn_endring WHERE id = ?
        """.trimIndent()

    val LAGRE_ENDRINGER =
        """
        INSERT INTO oms_meld_inn_endring (id, fnr, endring, beskrivelse, status, tidspunkt, forventet_inntekt_til_neste_aar) values (?,?,?,?,?,?,?)
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

inline fun <reified T : Any> PreparedStatement.setJsonb(
    parameterIndex: Int,
    jsonb: T?,
): PreparedStatement {
    if (jsonb == null) {
        this.setNull(parameterIndex, java.sql.Types.NULL)
    }
    val jsonObject = PGobject()
    jsonObject.type = "json"
    jsonObject.value = objectMapper.writeValueAsString(jsonb)
    this.setObject(parameterIndex, jsonObject)
    return this
}