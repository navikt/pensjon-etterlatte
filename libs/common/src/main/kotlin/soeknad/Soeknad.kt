package no.nav.etterlatte.libs.common.soeknad

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import soeknad.UtfyltSoeknad
import java.time.LocalDateTime
import java.time.ZoneId


@JsonIgnoreProperties(ignoreUnknown = true)
data class Soeknad(
    var imageTag: String?,
    var soeknadsType: SoeknadType?,
    val mottattDato: String = LocalDateTime.now(ZoneId.of("Europe/Oslo")).toString(),
    val oppsummering: List<Gruppe>,
    val utfyltSoeknad: UtfyltSoeknad
) {
    init {
        val oppsummering = this.oppsummering

        if (oppsummering.isEmpty())
            throw Exception("Søknad mangler grupper")
        else if (oppsummering.size < 5)
            throw Exception("Søknad inneholder færre grupper enn forventet")
        else if (oppsummering.size > 5)
            throw Exception("Søknad inneholder flere grupper enn forventet")
        else {
            oppsummering.forEach { gruppe ->
                if (gruppe.tittel.isBlank())
                    throw Exception("Søknad inneholder gruppe uten tittel")
                else if (gruppe.elementer.isEmpty())
                    throw Exception("Søknad inneholder gruppe uten underelementer")
            }
        }
    }
}
