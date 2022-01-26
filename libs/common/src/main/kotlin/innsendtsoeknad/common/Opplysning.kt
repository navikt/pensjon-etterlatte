package no.nav.etterlatte.libs.common.innsendtsoeknad.common

import java.time.LocalDate

data class Opplysning<T>(
    val svar: T,
    val spoersmaal: String? = null,
)

data class BetingetOpplysning<T, R>(
    val svar: T,
    val spoersmaal: String? = null,
    val opplysning: R?,
)

interface Svar {
    val svar: Any
}

data class FritekstSvar(
    override val svar: String
): Svar

data class DatoSvar(
    override val svar: LocalDate
): Svar

data class EnumSvar<E: Enum<E>>(
    val verdi: E,
    override val svar: String
): Svar

enum class JaNeiVetIkke { JA, NEI, VET_IKKE }
