package soeknad

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import com.fasterxml.jackson.annotation.JsonValue
import no.nav.etterlatte.libs.common.soeknad.Valg

@JsonIgnoreProperties(ignoreUnknown = true)
data class OmDeg(
    val bostedsadresseBekreftet: Valg?,
    val alternativAdresse: String?,
    val kontaktinfo: Kontaktinfo,
    val utbetalingsInformasjon: UtbetalingsInformasjon,
    val flyktning: Valg?,
    val oppholderSegINorge: Valg?,
    val oppholdsland: String?,
    val medlemFolketrygdenUtland: Valg?,
    val nySivilstatus: NySivilstatus?
)

data class Kontaktinfo(
    val epost: String,
    val telefonnummer: String
)

data class UtbetalingsInformasjon(
    val kontonummer: String?,
    val bankkontoType: BankkontoType?,
    val utenlandskBankNavn: String?,
    val utenlandskBankAdresse: String?,
    val iban: String?,
    val swift: String?
)

enum class BankkontoType(@get:JsonValue val beskrivelse: String) {
    norsk("bankkontoType.norsk"),
    utenlandsk("bankkontoType.utenlandsk")
}
