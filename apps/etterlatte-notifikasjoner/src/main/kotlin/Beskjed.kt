package no.nav.etterlatte

import java.time.ZonedDateTime

interface Brukernotifikasjon {
    val id: Int
    val systembruker: String
    val eventTidspunkt: ZonedDateTime
    val fodselsnummer: String
    val eventId: String
    val grupperingsId: String
    val sikkerhetsnivaa: Int
    val sistOppdatert: ZonedDateTime
    val aktiv: Boolean
    val tekst: String
    val link: String?
}

data class Beskjed(
        override val id: Int,
        val uid: String,
        override val fodselsnummer: String,
        override val grupperingsId: String,
        override val eventId: String,
        override val eventTidspunkt: ZonedDateTime,
        override val systembruker: String,
        override val sikkerhetsnivaa: Int,
        override val sistOppdatert: ZonedDateTime,
        val synligFremTil: ZonedDateTime?,
        override val tekst: String,
        override val link: String?,
        override val aktiv: Boolean,
        val eksternVarsling: Boolean,
        val prefererteKanaler: List<String>
) : Brukernotifikasjon {

    override fun toString(): String {
        return "Beskjed(" +
                "id=$id, " +
                "uid=$uid, " +
                "fodselsnummer=***, " +
                "grupperingsId=$grupperingsId, " +
                "eventId=$eventId, " +
                "eventTidspunkt=$eventTidspunkt, " +
                "systembruker=***, " +
                "sikkerhetsnivaa=$sikkerhetsnivaa, " +
                "sistOppdatert=$sistOppdatert, " +
                "synligFremTil=$synligFremTil, " +
                "tekst=***, " +
                "link=***, " +
                "aktiv=$aktiv, " +
                "eksternVarsling=$eksternVarsling, " +
                "prefererteKanaler=$prefererteKanaler"
    }
}
