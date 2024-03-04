import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import io.mockk.every
import io.mockk.mockk
import io.mockk.slot
import io.mockk.verify
import no.nav.etterlatte.UtkastPubliserer
import no.nav.etterlatte.kafka.KafkaProdusent
import no.nav.etterlatte.toJson
import org.junit.jupiter.api.Assertions
import org.junit.jupiter.api.Test
import soeknad.LagretSoeknad
import java.util.*

class UtkastPublisererTest {
    private val kafkaProduser: KafkaProdusent<String, String> = mockk()
    private val soeknadSomSkalPubliseres = LagretSoeknad(123, "fnr", "{}")
    private val publiserer = UtkastPubliserer(kafkaProduser, "test")
    private val testNoekkel = UUID.nameUUIDFromBytes("fnr123".toByteArray()).toString()

    @Test
    fun `Created utkast for barnepensjon skal sendes på kafka`() {
        val slot = slot<String>()

        every { kafkaProduser.publiser(testNoekkel, capture(slot)) } returns mockk(relaxed = true)

        publiserer.publiserOpprettUtkastTilMinSide(soeknadSomSkalPubliseres, "barnepensjon-ui")

        verify {
            kafkaProduser.publiser(testNoekkel, capture(slot))
        }

        val message = jacksonObjectMapper().readTree(slot.captured)

        Assertions.assertEquals("created", message["@event_name"].textValue())
        Assertions.assertEquals("Søknad om barnepensjon", message["tittel"].textValue())
    }

    @Test
    fun `Created utkast for gjenlevendepensjon skal publisere på kafka`() {
        val slot = slot<String>()

        every { kafkaProduser.publiser(testNoekkel, capture(slot)) } returns mockk(relaxed = true)

        publiserer.publiserOpprettUtkastTilMinSide(soeknadSomSkalPubliseres, "gjenlevendepensjon-ui")

        verify {
            kafkaProduser.publiser(testNoekkel, capture(slot))
        }

        val message = jacksonObjectMapper().readTree(slot.captured)

        Assertions.assertEquals("created", message["@event_name"].textValue())
        Assertions.assertEquals("Søknad om gjenlevendepensjon eller overgangsstønad", message["tittel"].textValue())
    }

    @Test
    fun `Created utkast for omstillingsstønad skal publisere på kafka`() {
        val slot = slot<String>()

        every { kafkaProduser.publiser(testNoekkel, capture(slot)) } returns mockk(relaxed = true)

        publiserer.publiserOpprettUtkastTilMinSide(soeknadSomSkalPubliseres, "omstillingsstoenad-ui")

        verify {
            kafkaProduser.publiser(testNoekkel, capture(slot))
        }

        val message = jacksonObjectMapper().readTree(slot.captured)

        Assertions.assertEquals("created", message["@event_name"].textValue())
        Assertions.assertEquals("Søknad om omstillingsstønad", message["tittel"].textValue())
    }

    @Test
    fun `Created utkast for barnepensjon skal publisere på riktig format`() {
        val slot = slot<String>()

        val forventetMessage = mapOf(
            "@event_name" to "created",
            "utkastId" to "6dcce2d1-40ea-366e-b2a2-f367abc8b7f1",
            "ident" to "fnr",
            "link" to "test/barnepensjon/soknad",
            "tittel" to "Søknad om barnepensjon",
            "tittel_i18n" to mapOf(
                "nb" to "Søknad om barnepensjon",
                "nn" to "Søknad om barnepensjon",
                "en" to "Application for children’s pension"
            ),
            "metrics" to mapOf(
                "skjemanavn" to "Søknad om barnepensjon",
            )
        )

        every { kafkaProduser.publiser(testNoekkel, capture(slot)) } returns mockk(relaxed = true)

        publiserer.publiserOpprettUtkastTilMinSide(soeknadSomSkalPubliseres, "barnepensjon-ui")

        verify {
            kafkaProduser.publiser(testNoekkel, capture(slot))
        }

        val message = jacksonObjectMapper().readTree(slot.captured)

        Assertions.assertEquals(forventetMessage["@event_name"], message["@event_name"].textValue())
        Assertions.assertEquals(forventetMessage["utkastId"], message["utkastId"].textValue())
        Assertions.assertEquals(forventetMessage["ident"], message["ident"].textValue())
        Assertions.assertEquals(forventetMessage["link"], message["link"].textValue())
        Assertions.assertEquals(forventetMessage["tittel"], message["tittel"].textValue())
        Assertions.assertEquals(forventetMessage["tittel_i18n"]!!.toJson(), message["tittel_i18n"].toString())
        Assertions.assertEquals(forventetMessage["metrics"]!!.toJson(), message["metrics"].toString())
    }

    @Test
    fun `Deleted utkast for barnepensjon skal publisere på kafka`() {
        val slot = slot<String>()

        every { kafkaProduser.publiser(testNoekkel, capture(slot)) } returns mockk(relaxed = true)

        publiserer.publiserSlettUtkastFraMinSide("fnr", 123)

        verify {
            kafkaProduser.publiser(testNoekkel, capture(slot))
        }

        val message = jacksonObjectMapper().readTree(slot.captured)

        Assertions.assertEquals("deleted", message["@event_name"].textValue())
        Assertions.assertEquals(UUID.nameUUIDFromBytes("fnr123".toByteArray()).toString(), message["utkastId"].textValue())
    }

}
