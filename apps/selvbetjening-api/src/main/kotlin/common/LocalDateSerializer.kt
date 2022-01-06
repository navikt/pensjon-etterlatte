package no.nav.etterlatte.common

import com.fasterxml.jackson.core.JsonParser
import com.fasterxml.jackson.databind.DeserializationContext
import com.fasterxml.jackson.databind.JsonDeserializer
import java.time.LocalDate
import java.time.ZoneId
import java.time.ZonedDateTime

class LocalDateSerializer : JsonDeserializer<LocalDate?>() {
    override fun deserialize(p: JsonParser?, ctxt: DeserializationContext?): LocalDate? {
        val value = p?.readValueAs(String::class.java)

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
