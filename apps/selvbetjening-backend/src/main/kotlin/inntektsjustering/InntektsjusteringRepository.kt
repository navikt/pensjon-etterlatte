package no.nav.etterlatte.inntektsjustering

import no.nav.etterlatte.inntektsjustering.Queries.HENT
import no.nav.etterlatte.inntektsjustering.Queries.LAGRE
import no.nav.etterlatte.libs.common.person.Foedselsnummer
import javax.sql.DataSource
import java.sql.ResultSet
import java.util.UUID

class InntektsjusteringRepository(
	private val ds: DataSource
) {

	private val connection get() = ds.connection

	fun hentInntektsjustering(fnr: Foedselsnummer) = connection.use {
		it
			.prepareStatement(HENT)
			.apply {
				setString(1, fnr.value)
			}.executeQuery()
			.singleOrNull {
				Inntektsjustering(
					arbeidsinntekt = getInt("arbeidsinntekt"),
					naeringsinntekt = getInt("naeringsinntekt"),
					arbeidsinntektUtland = getInt("arbeidsinntekt_utland"),
					naeringsinntektUtland = getInt("naeringsinntekt_utland")
				)
			}
	}

	fun lagreInntektsjustering(fnr: Foedselsnummer, inntektsjustering: Inntektsjustering) = connection.use {
		it.prepareStatement(LAGRE)
			.apply {
				setObject(1, UUID.randomUUID())
				setString(2, fnr.value)
				setInt(3, inntektsjustering.arbeidsinntekt)
				setInt(4, inntektsjustering.naeringsinntekt)
				setInt(5, inntektsjustering.arbeidsinntektUtland)
				setInt(6, inntektsjustering.naeringsinntektUtland)
			}.execute()
	}

	// TODO lib
	private fun <T> ResultSet.singleOrNull(block: ResultSet.() -> T): T? =
		if (next()) {
			block().also {
				require(!next()) { "Skal være unik" }
			}
		} else {
			null
		}

	private fun ResultSet.getUUID(name: String) = getObject(name) as UUID
}

private object Queries {
	val HENT = """
		SELECT * FROM inntektsjustering
		WHERE fnr = ?
		""".trimIndent()

	val LAGRE = """
		INSERT INTO inntektsjustering (id, fnr, arbeidsinntekt, naeringsinntekt, arbeidsinntekt_utland, naeringsinntekt_utland)
		VALUES (?, ?, ?, ?, ?, ?)
	""".trimIndent()
}