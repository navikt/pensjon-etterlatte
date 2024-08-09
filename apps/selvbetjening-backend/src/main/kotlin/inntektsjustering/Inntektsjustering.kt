package no.nav.etterlatte.inntektsjustering

import java.time.LocalDateTime

data class Inntektsjustering(
	val arbeidsinntekt: Int,
	val naeringsinntekt: Int,
	val arbeidsinntektUtland: Int,
	val naeringsinntektUtland: Int,
	val tidspunkt: LocalDateTime
)

data class InntektsjusteringLagre(
	val arbeidsinntekt: Int,
	val naeringsinntekt: Int,
	val arbeidsinntektUtland: Int,
	val naeringsinntektUtland: Int
)
