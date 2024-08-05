package no.nav.etterlatte.inntektsjustering

data class Inntektsjustering(
	val arbeidsinntekt: Int,
	val naeringsinntekt: Int,
	val arbeidsinntektUtland: Int,
	val naeringsinntektUtland: Int
)