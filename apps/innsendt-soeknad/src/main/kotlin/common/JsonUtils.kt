package no.nav.etterlatte.common

import org.slf4j.LoggerFactory
import tools.jackson.databind.DeserializationFeature
import tools.jackson.databind.cfg.DateTimeFeature
import tools.jackson.databind.cfg.EnumFeature
import tools.jackson.module.kotlin.jacksonMapperBuilder
import tools.jackson.module.kotlin.readValue

// TODO: Fjern etter Jackson 3-migrering er verifisert
private val jacksonMigLog = LoggerFactory.getLogger("JacksonMigrering")
private val jacksonMigSikkerLogg = LoggerFactory.getLogger("sikkerLogg")

val objectMapper =
    jacksonMapperBuilder()
        .enable(EnumFeature.READ_UNKNOWN_ENUM_VALUES_AS_NULL)
        .disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES)
        .disable(DateTimeFeature.WRITE_DATES_AS_TIMESTAMPS)
        .build()
        .also { m ->
            // TODO: Fjern etter Jackson 3-migrering er verifisert
            jacksonMigLog.info(
                "[Jackson3-verifisering] innsendt-soeknad common objectMapper initialisert:" +
                    " versjon=${m.version()}," +
                    " moduler=${m.registeredModuleIds}," +
                    " FAIL_ON_UNKNOWN_PROPERTIES=${m.deserializationConfig.isEnabled(
                        DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES,
                    )}," +
                    " READ_UNKNOWN_ENUM_VALUES_AS_NULL=${m.deserializationConfig.isEnabled(
                        EnumFeature.READ_UNKNOWN_ENUM_VALUES_AS_NULL,
                    )}," +
                    " WRITE_DATES_AS_TIMESTAMPS=${m.serializationConfig.isEnabled(
                        DateTimeFeature.WRITE_DATES_AS_TIMESTAMPS,
                    )}",
            )
        }

fun Any.toJson(): String =
    objectMapper.writeValueAsString(this).also { json ->
        // TODO: Fjern etter Jackson 3-migrering er verifisert
        jacksonMigLog.debug(
            "[Jackson3-verifisering] common.toJson() OK: type=${this::class.simpleName}, lengde=${json.length}",
        )
        jacksonMigSikkerLogg.debug(
            "[Jackson3-verifisering] common.toJson() innhold (type=${this::class.simpleName}):\n$json",
        )
    }

inline fun <reified T : Any> mapJsonToAny(
    json: String,
    failonunknown: Boolean = false,
): T =
    objectMapper.readValue<T>(json).also {
        // TODO: Fjern etter Jackson 3-migrering er verifisert
        jacksonMigLog.debug("[Jackson3-verifisering] mapJsonToAny() OK: måltype=${T::class.simpleName}")
        jacksonMigSikkerLogg.debug(
            "[Jackson3-verifisering] mapJsonToAny() input (måltype=${T::class.simpleName}):\n$json",
        )
    }