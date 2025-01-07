package no.nav.etterlatte.no.nav.etterlatte.no.nav.etterlatte.endringer

import no.nav.etterlatte.endringer.EndringType
import no.nav.etterlatte.endringer.Endringer
import no.nav.etterlatte.libs.common.person.Foedselsnummer
import no.nav.etterlatte.libs.utils.database.firstOrNull
import no.nav.etterlatte.no.nav.etterlatte.no.nav.etterlatte.endringer.Queries.HENT_ENDRING
import no.nav.etterlatte.no.nav.etterlatte.no.nav.etterlatte.endringer.Queries.LAGRE_ENDRINGER
import java.sql.Timestamp
import java.util.UUID
import javax.sql.DataSource

class EndringerRepository(
    private val ds: DataSource,
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
                    Endringer(
                        id = UUID.fromString(getString("id")),
                        fnr = Foedselsnummer.of(getString("fnr")),
                        type = EndringType.valueOf(getString("type")),
                        endringer = getString("endringer"),
                        tidspunkt = getTimestamp("tidspunkt").toInstant(),
                    )
                }
        }

    fun lagreEndringer(endringer: Endringer) =
        connection.use {
            it
                .prepareStatement(LAGRE_ENDRINGER)
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
        SELECT * FROM endringer WHERE id = ?
        """.trimIndent()

    val LAGRE_ENDRINGER =
        """
        INSERT INTO endringer (id, fnr, type, endringer, tidspunkt) values (?,?,?,?,?)
        """.trimIndent()
}