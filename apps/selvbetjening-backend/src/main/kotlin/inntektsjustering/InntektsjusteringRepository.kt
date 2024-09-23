package no.nav.etterlatte.inntektsjustering

import no.nav.etterlatte.inntektsjustering.Queries.HENT_FOR_FNR
import no.nav.etterlatte.inntektsjustering.Queries.HENT_FOR_FNR_OG_STATUS
import no.nav.etterlatte.inntektsjustering.Queries.HENT_FOR_STATUS
import no.nav.etterlatte.inntektsjustering.Queries.LAGRE
import no.nav.etterlatte.inntektsjustering.Queries.OPPDATER
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

    fun hentInntektsjusteringForFnrOgStatus(
        fnr: Foedselsnummer,
        status: PubliserInntektsjusteringStatus,
    ) = connection.use {
        it
            .prepareStatement(HENT_FOR_FNR_OG_STATUS)
            .apply {
                setString(1, fnr.value)
                setString(2, status.value)
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

    fun hentAlleInntektsjusteringerForStatus(status: PubliserInntektsjusteringStatus) =
        connection.use {
            it
                .prepareStatement(HENT_FOR_STATUS)
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

    fun oppdaterInntektsjustering(
        id: UUID,
        inntektsjustering: InntektsjusteringLagre,
    ) = connection.use {
        it
            .prepareStatement(OPPDATER)
            .apply {
                setInt(1, inntektsjustering.arbeidsinntekt)
                setInt(2, inntektsjustering.naeringsinntekt)
                setInt(3, inntektsjustering.arbeidsinntektUtland)
                setInt(4, inntektsjustering.naeringsinntektUtland)
                setInt(5, inntektsjustering.inntektsaar)
                setObject(6, id)
            }.executeUpdate()
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
}

private object Queries {
    val HENT_FOR_FNR =
        """
        SELECT * FROM inntektsjustering
        WHERE fnr = ?
        ORDER BY innsendt DESC
        """.trimIndent()

    val HENT_FOR_FNR_OG_STATUS =
        """
        SELECT * FROM inntektsjustering
        WHERE fnr = ? AND status = ?
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

    val OPPDATER =
        """
        UPDATE inntektsjustering
        SET 
            arbeidsinntekt = ?,
            naeringsinntekt = ?,
            arbeidsinntekt_utland = ?,
            naeringsinntekt_utland = ?,
            inntektsaar = ?
        WHERE id = ?
        """.trimIndent()
}