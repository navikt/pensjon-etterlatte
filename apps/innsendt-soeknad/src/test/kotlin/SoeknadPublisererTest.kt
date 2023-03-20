import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import no.nav.etterlatte.SoeknadPubliserer
import no.nav.helse.rapids_rivers.MessageContext
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.fail
import org.junit.jupiter.api.Test
import soeknad.LagretSoeknad
import soeknad.SoeknadID
import soeknad.SoeknadRepository
import soeknad.UlagretSoeknad
import java.time.Clock
import java.time.LocalDateTime
import java.time.Month
import java.time.OffsetDateTime
import java.time.ZoneId
import java.time.ZoneOffset
import java.util.*

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

        val soeknadSomSkalPubliseres = LagretSoeknad(123, "fnr", "{}")

        subject.publiser(soeknadSomSkalPubliseres)

        assertEquals(1, publieserteSoeknader.size)
        assertEquals(1, rapidStub.publishedMessages.size)
        assertEquals(123.toString(), rapidStub.publishedMessages[0].first)
        assertEquals(soeknadSomSkalPubliseres.id, publieserteSoeknader[0])

    }

    @Test
    fun `meldingen som publiseres skal ha riktig format`() {
        val rapidStub = MessageContextStub()
        val dbStub = SoeknadRepositoryNoOp()
        val clock: Clock = Clock.fixed(LocalDateTime.of(2020, Month.MAY, 5, 14, 5, 2).toInstant(ZoneOffset.UTC), ZoneId.of("UTC"))
        val subject = SoeknadPubliserer(rapidStub, dbStub, clock)
        val soeknadSomSkalPubliseres = LagretSoeknad(123, "fnr", "{}")
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

    override fun rapidName(): String {
        TODO("Not yet implemented")
    }

}

class SoeknadRepositoryNoOp(private val op: ()->Unit = {}): SoeknadRepository {

    override fun ferdigstillSoeknad(soeknad: UlagretSoeknad): SoeknadID {
        TODO("Not yet implemented")
    }

    override fun lagreKladd(soeknad: UlagretSoeknad): LagretSoeknad {
        TODO("Not yet implemented")
    }

    override fun soeknadSendt(id: SoeknadID) = op()
    override fun soeknadArkivert(id: SoeknadID, payload: String?) = op()
    override fun soeknadTilDoffenArkivert(id: SoeknadID, payload: String?) = op()

    override fun soeknadHarBehandling(id: SoeknadID, sakId: Long, behandlingId: UUID) = op()

    override fun soeknadFeiletArkivering(id: SoeknadID, jsonFeil: String)  = op()
    override fun usendteSoeknader(): List<LagretSoeknad> {
        op()
        return emptyList()
    }

    override fun slettArkiverteSoeknader(): Int {
        op()
        return 1
    }

    override fun finnKladd(fnr: String, kilde: String): LagretSoeknad? {
        TODO("Not yet implemented")
    }

    override fun slettKladd(fnr: String, kilde: String): SoeknadID? {
        TODO("Not yet implemented")
    }

    override fun slettOgKonverterKladd(fnr: String, kilde: String): SoeknadID? {
        TODO("Not yet implemented")
    }

    override fun slettUtgaatteKladder(): Int {
        TODO("Not yet implemented")
    }

    override fun arkiverteUtenBehandlingIDoffen(): List<LagretSoeknad> {
        TODO("Not yet implemented")
    }
}
