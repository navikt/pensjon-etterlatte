import no.nav.etterlatte.SendNotifikasjon
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test
import java.time.Instant
import java.time.LocalDateTime
import java.time.ZoneOffset

class SendNotifikasjonTest {
    private val sendNotifikasjon = SendNotifikasjon(
        mapOf(
            "BRUKERNOTIFIKASJON_BESKJED_TOPIC" to "test_topic",
            "KAFKA_BROKERS" to "host.docker.internal:9092",
            "KAFKA_SCHEMA_REGISTRY" to "tjoho",
            "KAFKA_KEYSTORE_PATH" to "",
            "KAFKA_TRUSTSTORE_PATH" to "",
            "KAFKA_CREDSTORE_PASSWORD" to "",
            "KAFKA_SCHEMA_REGISTRY" to "",
            "KAFKA_SCHEMA_REGISTRY_USER" to "",
            "KAFKA_SCHEMA_REGISTRY_PASSWORD" to "",
        )
    )

    //@Test
    fun opprettMelding() {
        val beskjed = sendNotifikasjon.opprettBeskjed()

        //assertEquals("11057523044", beskjed.get  .getFodselsnummer())
        //assertEquals("ETTERLATTE", beskjed .getGrupperingsId())
        assertEquals("Vi har mottatt søknaden din om gjenlevendepensjon", beskjed.getTekst())
        assertEquals(true, isWithin10Seconds(beskjed.getTidspunkt().toLocalDateTime()))
        assertEquals(
            true,
            isWithin10Seconds(
                beskjed.getSynligFremTil().toLocalDateTime(),
                LocalDateTime.now(ZoneOffset.UTC).plusDays(7)
            )
        )
        assertEquals(4, beskjed.getSikkerhetsnivaa())
        assertEquals(false, beskjed.getEksternVarsling())
    }
}

fun isWithin10Seconds(actual: LocalDateTime, expected: LocalDateTime = LocalDateTime.now(ZoneOffset.UTC)): Boolean =
    actual.isBefore(expected.plusSeconds(10)) && actual.isAfter(expected.minusSeconds(10))

fun Long.toLocalDateTime(): LocalDateTime = LocalDateTime.ofInstant(Instant.ofEpochMilli(this), ZoneOffset.UTC)
