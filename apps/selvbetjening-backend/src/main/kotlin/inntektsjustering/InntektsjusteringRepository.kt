package no.nav.etterlatte.inntektsjustering

import no.nav.etterlatte.inntektsjustering.Queries.HENT
import no.nav.etterlatte.inntektsjustering.Queries.LAGRE
import no.nav.etterlatte.libs.common.person.Foedselsnummer
import no.nav.etterlatte.libs.utils.database.firstOrNull
import no.nav.etterlatte.libs.utils.database.singleOrNull
import java.sql.Timestamp
import java.time.LocalDateTime
import java.time.ZoneId
import javax.sql.DataSource
import java.util.UUID

class InntektsjusteringRepository(
	private val ds: DataSource
) {

	private val connection get() = ds.connection

	private val postgresTimeZone = ZoneId.of("UTC")

	fun hentInntektsjustering(fnr: Foedselsnummer) = connection.use {
		it
			.prepareStatement(HENT)
			.apply {
				setString(1, fnr.value)
			}.executeQuery()
			.firstOrNull{
				Inntektsjustering(
					id = UUID.fromString(getString("id")),
					arbeidsinntekt = getInt("arbeidsinntekt"),
					naeringsinntekt = getInt("naeringsinntekt"),
					arbeidsinntektUtland = getInt("arbeidsinntekt_utland"),
					naeringsinntektUtland = getInt("naeringsinntekt_utland"),
					tidspunkt = getTimestamp("innsendt").asLocalDateTime()
				)
			}
	}

	fun lagreInntektsjustering(fnr: Foedselsnummer, inntektsjustering: InntektsjusteringLagre) = connection.use {
		it.prepareStatement(LAGRE)
			.apply {
				setObject(1, inntektsjustering.id)
				setString(2, fnr.value)
				setInt(3, inntektsjustering.arbeidsinntekt)
				setInt(4, inntektsjustering.naeringsinntekt)
				setInt(5, inntektsjustering.arbeidsinntektUtland)
				setInt(6, inntektsjustering.naeringsinntektUtland)
			}.execute()
	}

	private fun Timestamp.asLocalDateTime(): LocalDateTime =
		toLocalDateTime()
			.atZone(postgresTimeZone)
			.withZoneSameInstant(ZoneId.systemDefault())
			.toLocalDateTime()
}

private object Queries {
	val HENT = """
		SELECT * FROM inntektsjustering
		WHERE fnr = ?
		ORDER BY innsendt DESC
		""".trimIndent()

	val LAGRE = """
		INSERT INTO inntektsjustering (id, fnr, arbeidsinntekt, naeringsinntekt, arbeidsinntekt_utland, naeringsinntekt_utland)
		VALUES (?, ?, ?, ?, ?, ?)
	""".trimIndent()
}