package no.nav.etterlatte.common

import com.fasterxml.jackson.databind.DeserializationFeature
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.databind.SerializationFeature
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue

val objectMapper: ObjectMapper = jacksonObjectMapper()
    .enable(DeserializationFeature.READ_UNKNOWN_ENUM_VALUES_AS_NULL)
    .disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES)
    .disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS)
    .registerModule(JavaTimeModule())

fun Any.toJson(): String = objectMapper.writeValueAsString(this)

inline fun <reified T : Any> mapJsonToAny(json: String, failonunknown: Boolean = false): T {
    return objectMapper.let {
        if (failonunknown) it.enable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES)
        else it
    }.readValue(json)
}
