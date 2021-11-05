package soeknad

import com.fasterxml.jackson.annotation.JsonIgnoreProperties

@JsonIgnoreProperties(ignoreUnknown = true)
data class UtfyltSoeknad(
    val harSamtykket: Boolean,
    val omDeg: OmDeg,
    val omDegOgAvdoed: OmDegOgAvdoed,
    val omDenAvdoede: OmDenAvdoede,
    val dinSituasjon: DinSituasjon,
    val opplysningerOmBarn: OpplysningerOmBarn,
)
