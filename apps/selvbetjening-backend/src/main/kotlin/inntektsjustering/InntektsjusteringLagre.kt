package no.nav.etterlatte.inntektsjustering

import java.util.UUID

data class InntektsjusteringLagre(
    val id: UUID = UUID.randomUUID(),
    val arbeidsinntekt: Int,
    val naeringsinntekt: Int,
    val arbeidsinntektUtland: Int,
    val naeringsinntektUtland: Int,
)