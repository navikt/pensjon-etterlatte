package no.nav.etterlatte.inntektsjustering

import no.nav.etterlatte.inntektsjustering.Queries.HENT_FOR_FNR
import no.nav.etterlatte.inntektsjustering.Queries.HENT_FOR_FNR_OG_STATUS
import no.nav.etterlatte.inntektsjustering.Queries.HENT_FOR_STATUS
import no.nav.etterlatte.inntektsjustering.Queries.LAGRE
import no.nav.etterlatte.inntektsjustering.Queries.OPPDATER
import no.nav.etterlatte.inntektsjustering.Queries.OPPDATER_STATUS
import no.nav.etterlatte.libs.common.inntektsjustering.Inntektsjustering
import no.nav.etterlatte.libs.common.person.Foedselsnummer
import no.nav.etterlatte.libs.utils.database.firstOrNull
import no.nav.etterlatte.libs.utils.database.toList
import java.sql.Date
import java.sql.PreparedStatement
import java.sql.ResultSet
import java.sql.Timestamp
import java.sql.Types
import java.time.Instant
import java.util.UUID
import javax.sql.DataSource

class InntektsjusteringRepository(
    private val ds: DataSource,
) {
    private val connection get() = ds.connection

    fun hentInntektsjusteringForFnr(fnr: Foedselsnummer) =
        connection.use {
            it
                .prepareStatement(HENT_FOR_FNR)
                .apply {
                    setString(1, fnr.value)
                }.executeQuery()
                .firstOrNull { this.toInntektsjustering() }
        }

    fun hentInntektsjusteringForFnrOgStatus(
        fnr: Foedselsnummer,
        status: InntektsjusteringStatus,
    ) = connection.use {
        it
            .prepareStatement(HENT_FOR_FNR_OG_STATUS)
            .apply {
                setString(1, fnr.value)
                setString(2, status.name)
            }.executeQuery()
            .firstOrNull { this.toInntektsjustering() }
    }

    fun hentAlleInntektsjusteringerForStatus(status: InntektsjusteringStatus) =
        connection.use {
            it
                .prepareStatement(HENT_FOR_STATUS)
                .apply {
                    setString(1, status.name)
                }.executeQuery()
                .toList {
                    this.toInntektsjustering()
                }
        }

    fun lagreInntektsjustering(
        fnr: Foedselsnummer,
        inntektsjustering: InntektsjusteringLagre,
    ) = connection.use {
        it
            .prepareStatement(LAGRE)
            .apply {
                setObject(1, UUID.randomUUID())
                setString(2, fnr.value)
                setInt(3, inntektsjustering.inntektsaar)
                setInt(4, inntektsjustering.arbeidsinntekt)
                setInt(5, inntektsjustering.naeringsinntekt)
                setInt(6, inntektsjustering.inntektFraUtland)
                setInt(7, inntektsjustering.afpInntekt)
                setString(8, inntektsjustering.afpTjenesteordning)
                setString(9, inntektsjustering.skalGaaAvMedAlderspensjon ?: "NEI")
                setDate(10, inntektsjustering.datoForAaGaaAvMedAlderspensjon?.let { dato -> Date.valueOf(dato) })
                setString(11, InntektsjusteringStatus.LAGRET.name)
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
                setInt(3, inntektsjustering.inntektFraUtland)
                setInt(4, inntektsjustering.afpInntekt)
                setString(5, inntektsjustering.afpTjenesteordning)
                setString(6, inntektsjustering.skalGaaAvMedAlderspensjon)
                setDate(7, inntektsjustering.datoForAaGaaAvMedAlderspensjon?.let { dato -> Date.valueOf(dato) })
                setTimestamp(8, Timestamp.from(Instant.now()))
                setObject(9, id)
            }.executeUpdate()
    }

    fun oppdaterStatusForId(
        id: UUID,
        status: InntektsjusteringStatus,
    ) = connection.use {
        it
            .prepareStatement(OPPDATER_STATUS)
            .apply {
                setString(1, status.name)
                setTimestamp(2, Timestamp.from(Instant.now()))
                setObject(3, id)
            }.execute()
    }
}

fun ResultSet.toInntektsjustering() =
    Inntektsjustering(
        id = UUID.fromString(getString("id")),
        fnr = getString("fnr"),
        inntektsaar = getInt("inntektsaar"),
        arbeidsinntekt = getInt("arbeidsinntekt"),
        naeringsinntekt = getInt("naeringsinntekt"),
        inntektFraUtland = getInt("inntekt_fra_utland"),
        afpInntekt = getInt("afp_inntekt"),
        afpTjenesteordning = getString("afp_tjenesteordning"),
        skalGaaAvMedAlderspensjon = getString("skal_gaa_av_med_alderspensjon"),
        datoForAaGaaAvMedAlderspensjon = getDate("dato_for_aa_gaa_av_med_alderspensjon")?.toLocalDate(),
        tidspunkt = getTimestamp("innsendt").toInstant(),
    )

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
        INSERT INTO inntektsjustering (id, fnr, inntektsaar, arbeidsinntekt, naeringsinntekt, inntekt_fra_utland, afp_inntekt, afp_tjenesteordning, skal_gaa_av_med_alderspensjon, dato_for_aa_gaa_av_med_alderspensjon, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """.trimIndent()

    val OPPDATER_STATUS =
        """
        UPDATE inntektsjustering
        SET status = ?, sist_endret = ?
         WHERE id = ?
        """.trimIndent()

    val OPPDATER =
        """
        UPDATE inntektsjustering
        SET 
            arbeidsinntekt = ?,
            naeringsinntekt = ?,
            inntekt_fra_utland = ?,
            afp_inntekt = ?,
            afp_tjenesteordning = ?,
            skal_gaa_av_med_alderspensjon = ?,
            dato_for_aa_gaa_av_med_alderspensjon = ?,
            sist_endret = ?
        WHERE id = ?
        """.trimIndent()
}

fun PreparedStatement.setInt(
    index: Int,
    value: Int?,
) = if (value == null) setNull(index, Types.BIGINT) else setInt(index, value)