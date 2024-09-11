package no.nav.etterlatte.inntektsjustering

import no.nav.etterlatte.inntektsjustering.Queries.HENT_FOR_FNR
import no.nav.etterlatte.inntektsjustering.Queries.HENT_SISTE_INNSENDT_FOR_STATUS
import no.nav.etterlatte.inntektsjustering.Queries.LAGRE
import no.nav.etterlatte.inntektsjustering.Queries.OPPDATER_STATUS
import no.nav.etterlatte.jobs.PubliserInntektsjusteringStatus
import no.nav.etterlatte.libs.common.inntektsjustering.Inntektsjustering
import no.nav.etterlatte.libs.common.person.Foedselsnummer
import no.nav.etterlatte.libs.utils.database.firstOrNull
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

    fun hentSisteInntektsjusteringForStatus(status: PubliserInntektsjusteringStatus) =
        connection.use {
            it
                .prepareStatement(HENT_SISTE_INNSENDT_FOR_STATUS)
                .apply {
                    setString(1, status.value)
                }.executeQuery()
                .use {
                    generateSequence {
                        if (it.next()) {
                            Inntektsjustering(
                                id = UUID.fromString(it.getString("id")),
                                inntektsaar = it.getInt("inntektsaar"),
                                arbeidsinntekt = it.getInt("arbeidsinntekt"),
                                naeringsinntekt = it.getInt("naeringsinntekt"),
                                arbeidsinntektUtland = it.getInt("arbeidsinntekt_utland"),
                                naeringsinntektUtland = it.getInt("naeringsinntekt_utland"),
                                tidspunkt = it.getTimestamp("innsendt").toInstant(),
                            )
                        } else {
                            null
                        }
                    }.toList()
                }
        }

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

    fun oppdaterInntektsjusteringStatus(
        id: UUID,
        status: PubliserInntektsjusteringStatus,
    ) = connection.use {
        it
            .prepareStatement(OPPDATER_STATUS)
            .apply {
                setObject(1, id)
                setString(2, status.value)
            }.execute()
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

    val HENT_SISTE_INNSENDT_FOR_STATUS =
        """
        
        WITH SISTE_INNSENDT AS (
            SELECT *,
                ROW_NUMBER() OVER (PARTITION BY fnr ORDER BY innsendt DESC) AS row_num
            FROM
                inntektsjustering
            WHERE
                status = ?
        )
        SELECT
            *
        FROM
            SISTE_INNSENDT
        WHERE
            row_num = 1
        """.trimIndent()
}