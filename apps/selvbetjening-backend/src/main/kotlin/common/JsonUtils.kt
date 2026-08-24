package no.nav.etterlatte.common

import tools.jackson.databind.DeserializationFeature
import tools.jackson.databind.cfg.DateTimeFeature
import tools.jackson.databind.cfg.EnumFeature
import tools.jackson.module.kotlin.jacksonMapperBuilder
import tools.jackson.module.kotlin.readValue

val objectMapper =
    jacksonMapperBuilder()
        .enable(EnumFeature.READ_UNKNOWN_ENUM_VALUES_AS_NULL)
        .disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES)
        .disable(DateTimeFeature.WRITE_DATES_AS_TIMESTAMPS)
        .build()

inline fun <reified T : Any> mapJsonToAny(
    json: String,
    failonunknown: Boolean = false,
): T = objectMapper.readValue(json)