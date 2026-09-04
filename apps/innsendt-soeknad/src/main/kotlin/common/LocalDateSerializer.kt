package no.nav.etterlatte.common

import tools.jackson.core.JsonParser
import tools.jackson.databind.DeserializationContext
import tools.jackson.databind.ValueDeserializer
import java.time.LocalDate
import java.time.ZoneId
import java.time.ZonedDateTime

class LocalDateSerializer : ValueDeserializer<LocalDate?>() {
    override fun deserialize(
        p: JsonParser,
        ctxt: DeserializationContext,
    ): LocalDate? {
        val value = p.readValueAs(String::class.java)

        return if (value?.contains("T") == true) {
            val zonedDateTimeValue = ZonedDateTime.parse(value)
            val zoneId = ZoneId.of("Europe/Oslo")
            zonedDateTimeValue.withZoneSameInstant(zoneId).toLocalDate()
        } else if (value != null && value != "") {
            LocalDate.parse(value)
        } else {
            null
        }
    }
}