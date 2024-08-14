package no.nav.etterlatte.inntektsjustering

import java.time.LocalDateTime
import java.util.UUID

data class Inntektsjustering(
	val id: UUID,
	val arbeidsinntekt: Int,
	val naeringsinntekt: Int,
	val arbeidsinntektUtland: Int,
	val naeringsinntektUtland: Int,
	val tidspunkt: LocalDateTime
)

data class InntektsjusteringLagre(
	val id: UUID = UUID.randomUUID(),
	val arbeidsinntekt: Int,
	val naeringsinntekt: Int,
	val arbeidsinntektUtland: Int,
	val naeringsinntektUtland: Int
)
