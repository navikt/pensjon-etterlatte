package no.nav.etterlatte

import org.slf4j.LoggerFactory
import tools.jackson.databind.DeserializationFeature
import tools.jackson.databind.cfg.DateTimeFeature
import tools.jackson.databind.cfg.EnumFeature
import tools.jackson.module.kotlin.jacksonMapperBuilder

// TODO: Fjern etter Jackson 3-migrering er verifisert
private val jacksonMigSikkerLogg = LoggerFactory.getLogger("sikkerLogg")

val mapper =
    jacksonMapperBuilder()
        .enable(EnumFeature.READ_UNKNOWN_ENUM_VALUES_AS_NULL)
        .disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES)
        .disable(DateTimeFeature.WRITE_DATES_AS_TIMESTAMPS)
        .build()

fun Any.toJson(): String =
    mapper.writeValueAsString(this).also { json ->
        // TODO: Fjern etter Jackson 3-migrering er verifisert
        jacksonMigSikkerLogg.debug("[Jackson3-verifisering] toJson() (type=${this::class.simpleName}):\n$json")
    }