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
)
