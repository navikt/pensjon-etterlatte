package no.nav.etterlatte.inntektsjustering

import no.nav.etterlatte.inntektsjustering.Queries.HENT_FOR_FNR
import no.nav.etterlatte.inntektsjustering.Queries.HENT_FOR_STATUS
import no.nav.etterlatte.inntektsjustering.Queries.LAGRE
import no.nav.etterlatte.inntektsjustering.Queries.OPPDATER_STATUS
import no.nav.etterlatte.jobs.PubliserInntektsjusteringStatus
import no.nav.etterlatte.libs.common.inntektsjustering.Inntektsjustering
import no.nav.etterlatte.libs.common.person.Foedselsnummer
import no.nav.etterlatte.libs.utils.database.firstOrNull
import no.nav.etterlatte.libs.utils.database.toList
import java.time.ZoneId
import java.util.UUID
import javax.sql.DataSource

class InntektsjusteringRepository(
    private val ds: DataSource,
) {
    private val connection get() = ds.connection

    private val postgresTimeZone = ZoneId.of("UTC")

    fun hentInntektsjusteringForFnr(fnr: Foedselsnummer) =
        connection.use {
            it
                .prepareStatement(HENT_FOR_FNR)
                .apply {
                    setString(1, fnr.value)
                }.executeQuery()
                .firstOrNull {
                    Inntektsjustering(
                        id = UUID.fromString(getString("id")),
                        inntektsaar = getInt("inntektsaar"),
                        arbeidsinntekt = getInt("arbeidsinntekt"),
                        naeringsinntekt = getInt("naeringsinntekt"),
                        arbeidsinntektUtland = getInt("arbeidsinntekt_utland"),
                        naeringsinntektUtland = getInt("naeringsinntekt_utland"),
                        tidspunkt = getTimestamp("innsendt").toInstant(),
                    )
                }
        }

    fun hentInntektsjusteringForStatus(status: PubliserInntektsjusteringStatus) =
        hentInntektsjusteringer(HENT_FOR_STATUS, status)

    fun lagreInntektsjustering(
        fnr: Foedselsnummer,
        inntektsjustering: InntektsjusteringLagre,
    ) = connection.use {
        it
            .prepareStatement(LAGRE)
            .apply {
                setObject(1, inntektsjustering.id)
                setString(2, fnr.value)
                setInt(3, inntektsjustering.arbeidsinntekt)
                setInt(4, inntektsjustering.naeringsinntekt)
                setInt(5, inntektsjustering.arbeidsinntektUtland)
                setInt(6, inntektsjustering.naeringsinntektUtland)
                setInt(7, inntektsjustering.inntektsaar)
                setString(8, PubliserInntektsjusteringStatus.LAGRET.value)
            }.execute()
    }

    fun oppdaterStatusForId(
        id: UUID,
        status: PubliserInntektsjusteringStatus,
    ) = connection.use {
        it
            .prepareStatement(OPPDATER_STATUS)
            .apply {
                setString(1, status.value)
                setObject(2, id)
            }.execute()
    }

    private fun hentInntektsjusteringer(
        query: String,
        status: PubliserInntektsjusteringStatus,
    ): List<Pair<String, Inntektsjustering>> =
        connection.use {
            it
                .prepareStatement(query)
                .apply {
                    setString(1, status.value)
                }.executeQuery()
                .toList {
                    Pair(
                        getString("fnr"),
                        Inntektsjustering(
                            id = UUID.fromString(getString("id")),
                            inntektsaar = getInt("inntektsaar"),
                            arbeidsinntekt = getInt("arbeidsinntekt"),
                            naeringsinntekt = getInt("naeringsinntekt"),
                            arbeidsinntektUtland = getInt("arbeidsinntekt_utland"),
                            naeringsinntektUtland = getInt("naeringsinntekt_utland"),
                            tidspunkt = getTimestamp("innsendt").toInstant(),
                        ),
                    )
                }
        }
}

private object Queries {
    val HENT_FOR_FNR =
        """
        SELECT * FROM inntektsjustering
        WHERE fnr = ?
        ORDER BY innsendt DESC
        """.trimIndent()

    val HENT_FOR_STATUS =
        """
        SELECT * FROM inntektsjustering
        WHERE status = ?
        ORDER BY innsendt DESC
        """.trimIndent()

    val LAGRE =
        """
        INSERT INTO inntektsjustering (id, fnr, arbeidsinntekt, naeringsinntekt, arbeidsinntekt_utland, naeringsinntekt_utland, inntektsaar, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """.trimIndent()

    val OPPDATER_STATUS =
        """
        UPDATE inntektsjustering
        SET status = ? WHERE id = ?
        """.trimIndent()
}