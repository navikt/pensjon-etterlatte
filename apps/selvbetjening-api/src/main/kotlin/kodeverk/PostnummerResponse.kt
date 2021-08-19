package no.nav.etterlatte.kodeverk

import com.fasterxml.jackson.annotation.JsonIgnoreProperties


data class Beskrivelse(val term: String, val tekst: String)

data class PostnummerInfo(val gyldigFra: String, val gyldigTil: String, val beskrivelser: Map<String, Beskrivelse>)

@JsonIgnoreProperties(ignoreUnknown = true)
data class PostnummerResponse(val betydninger: Map<String, List<PostnummerInfo>>)