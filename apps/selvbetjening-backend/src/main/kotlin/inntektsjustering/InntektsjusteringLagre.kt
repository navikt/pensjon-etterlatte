package no.nav.etterlatte.inntektsjustering

import java.time.LocalDate
import java.util.UUID

data class InntektsjusteringLagre(
    val id: UUID = UUID.randomUUID(), // TODO
    val inntektsaar: Int = 2025, // TODO
    val arbeidsinntekt: Int,
    val naeringsinntekt: Int,
    val inntektFraUtland: Int,
    val AFPInntekt: Int,
    val AFPTjenesteordning: String?,
    val skalGaaAvMedAlderspensjon: String,
    val datoForAaGaaAvMedAlderspensjon: LocalDate?,
)