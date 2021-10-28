import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import no.nav.etterlatte.LagretSoeknad
import no.nav.etterlatte.SoeknadID
import no.nav.etterlatte.SoeknadPubliserer
import no.nav.etterlatte.SoeknadRepository
import no.nav.etterlatte.UlagretSoeknad
import no.nav.helse.rapids_rivers.MessageContext
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.fail
import org.junit.jupiter.api.Test
import java.time.Clock
import java.time.LocalDateTime
import java.time.Month
import java.time.OffsetDateTime
import java.time.ZoneId
import java.time.ZoneOffset

class SoeknadPublisererTest {

    @Test
    fun `soeknad skal sendes på rapid og det skal lagres hendelse om at den er sendt`() {
        val rapidStub = MessageContextStub()
        val publieserteSoeknader = mutableListOf<SoeknadID>()

        val dbStub = object : SoeknadRepository by SoeknadRepositoryNoOp({ fail() }) {
            override fun soeknadSendt(id: SoeknadID) {
                publieserteSoeknader += id
            }
        }

        val subject = SoeknadPubliserer(rapidStub, dbStub)

        val soeknadSomSkalPubliseres = LagretSoeknad("1", "{}", 123)

        subject.publiser(soeknadSomSkalPubliseres)

        assertEquals(1, publieserteSoeknader.size)
        assertEquals(1, rapidStub.publishedMessages.size)
        assertEquals(123.toString(), rapidStub.publishedMessages[0].first)
        assertEquals(soeknadSomSkalPubliseres, publieserteSoeknader[0])

    }

    @Test
    fun `meldingen som publiseres skal ha riktig format`() {
        val rapidStub = MessageContextStub()
        val dbStub = SoeknadRepositoryNoOp()
        val clock: Clock = Clock.fixed(LocalDateTime.of(2020, Month.MAY, 5, 14, 5, 2).toInstant(ZoneOffset.UTC), ZoneId.of("UTC"))
        val subject = SoeknadPubliserer(rapidStub, dbStub, clock)
        val soeknadSomSkalPubliseres = LagretSoeknad("1", "{}", 123)
        subject.publiser(soeknadSomSkalPubliseres)

        assertEquals(1, rapidStub.publishedMessages.size)
        assertEquals(123.toString(), rapidStub.publishedMessages[0].first)
        println(rapidStub.publishedMessages[0].second)
        val message = jacksonObjectMapper().readTree(rapidStub.publishedMessages[0].second)

        assertEquals("soeknad_innsendt", message["@event_name"].textValue())
        assertEquals(jacksonObjectMapper().readTree(soeknadSomSkalPubliseres.payload), message["@skjema_info"])
        assertEquals(soeknadSomSkalPubliseres.id, message["@lagret_soeknad_id"].longValue())
        assertEquals(soeknadSomSkalPubliseres.fnr, message["@fnr_soeker"].textValue())
        assertEquals(OffsetDateTime.of(LocalDateTime.of(2020, Month.MAY, 5, 14, 35, 2), ZoneOffset.UTC), OffsetDateTime.parse(message["@hendelse_gyldig_til"].textValue()))

    }

}

internal class MessageContextStub : MessageContext {
    val publishedMessages = mutableListOf<Pair<String?, String>>()
    override fun publish(message: String) {
        publishedMessages += null to message
    }

    override fun publish(key: String, message: String) {
        publishedMessages += key to message
    }

}

class SoeknadRepositoryNoOp(private val op: ()->Unit = {}): SoeknadRepository {

    override fun lagreSoeknad(soeknad: UlagretSoeknad): LagretSoeknad {
        op()
        return LagretSoeknad(soeknad.fnr, soeknad.payload, 0L)    }

    override fun lagreKladd(soeknad: UlagretSoeknad): LagretSoeknad {
        TODO("Not yet implemented")
    }

    override fun soeknadSendt(id: SoeknadID) = op()
    override fun soeknadArkivert(id: SoeknadID) = op()
    override fun soeknadFeiletArkivering(id: SoeknadID, jsonFeil: String)  = op()
    override fun usendteSoeknader(): List<LagretSoeknad> {
        op()
        return emptyList()
    }

    override fun slettArkiverteSoeknader(): Int {
        op()
        return 1
    }

    override fun soeknadFerdigstilt(id: SoeknadID) {
        TODO("Not yet implemented")
    }

    override fun finnKladd(fnr: String): LagretSoeknad? {
        TODO("Not yet implemented")
    }

    override fun slettKladd(fnr: String): Boolean {
        TODO("Not yet implemented")
    }

    override fun slettUtgaatteKladder(): Int {
        TODO("Not yet implemented")
    }
}
