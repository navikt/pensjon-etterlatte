package no.nav.etterlatte.omsendringer

import no.nav.etterlatte.libs.common.person.Foedselsnummer
import no.nav.etterlatte.libs.utils.database.firstOrNull
import java.sql.Timestamp
import java.util.UUID
import javax.sql.DataSource

class OmsMeldInnEndringRepository(
    private val ds: DataSource,
) {
    private val connection get() = ds.connection

    fun hentEndring(id: UUID) =
        connection.use {
            it
                .prepareStatement(Queries.HENT_ENDRING)
                .apply {
                    setObject(1, id)
                }.executeQuery()
                .firstOrNull {
                    OmsMeldtInnEndring(
                        id = UUID.fromString(getString("id")),
                        fnr = Foedselsnummer.of(getString("fnr")),
                        type = OmsEndringType.valueOf(getString("type")),
                        endringer = getString("endringer"),
                        tidspunkt = getTimestamp("tidspunkt").toInstant(),
                    )
                }
        }

    fun lagreEndringer(endringer: OmsMeldtInnEndring) =
        connection.use {
            it
                .prepareStatement(Queries.LAGRE_ENDRINGER)
                .apply {
                    setObject(1, endringer.id)
                    setString(2, endringer.fnr.value)
                    setString(3, endringer.type.name)
                    setString(4, endringer.endringer)
                    setTimestamp(5, Timestamp.from(endringer.tidspunkt))
                }.execute()
        }
}

private object Queries {
    val HENT_ENDRING =
        """
        SELECT * FROM oms_meld_inn_endring WHERE id = ?
        """.trimIndent()

    val LAGRE_ENDRINGER =
        """
        INSERT INTO oms_meld_inn_endring (id, fnr, type, endringer, tidspunkt) values (?,?,?,?,?)
        """.trimIndent()
}