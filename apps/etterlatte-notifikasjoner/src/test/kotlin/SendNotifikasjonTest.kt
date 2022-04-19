import no.nav.etterlatte.SendNotifikasjon
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test
import java.time.Instant
import java.time.LocalDateTime
import java.time.ZoneOffset
import io.mockk.mockk
import no.nav.brukernotifikasjon.schemas.input.BeskjedInput
import no.nav.brukernotifikasjon.schemas.input.NokkelInput
import org.apache.kafka.clients.producer.Producer
import soeknad.InnsendtSoeknadFixtures

class SendNotifikasjonTest {
    private val mockKafkaProducer = mockk<Producer<NokkelInput, BeskjedInput>>()
    private val sendNotifikasjon = SendNotifikasjon(
        mapOf(
        "BRUKERNOTIFIKASJON_BESKJED_TOPIC" to "test_topic",
    ), mockKafkaProducer)

    @Test
    fun `skal opprette melding for gjenlevendepensjon`() {
        val beskjed = sendNotifikasjon.opprettBeskjed(InnsendtSoeknadFixtures.gjenlevendepensjon())
        assertEquals(false, beskjed.getEksternVarsling())
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

    @Test
    fun `skal opprette melding for barnepensjon`() {
        val beskjed = sendNotifikasjon.opprettBeskjed(InnsendtSoeknadFixtures.barnepensjon())
        assertEquals(false, beskjed.getEksternVarsling())
        assertEquals("Vi har mottatt søknaden din om barnepensjon", beskjed.getTekst())
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
