package no.nav.etterlatte

import innsendtsoeknad.common.SoeknadType
import no.nav.brukernotifikasjon.schemas.builders.BeskjedInputBuilder
import no.nav.brukernotifikasjon.schemas.builders.NokkelInputBuilder
import no.nav.brukernotifikasjon.schemas.input.BeskjedInput
import no.nav.brukernotifikasjon.schemas.input.NokkelInput
import no.nav.etterlatte.libs.common.innsendtsoeknad.common.InnsendtSoeknad

import org.apache.kafka.clients.producer.KafkaProducer
import org.apache.kafka.clients.producer.Producer
import org.apache.kafka.clients.producer.ProducerRecord
import org.slf4j.Logger
import org.slf4j.LoggerFactory

import java.time.LocalDateTime
import java.time.ZoneOffset
import java.util.*
import java.util.concurrent.TimeUnit

class SendNotifikasjon(
    env: Map<String, String>,
    private val producer: Producer<NokkelInput, BeskjedInput> = KafkaProducer(KafkaConfig().getProducerConfig(env))
) {
    private val logger: Logger = LoggerFactory.getLogger(SendNotifikasjon::class.java)
    private val brukernotifikasjontopic = env["BRUKERNOTIFIKASJON_BESKJED_TOPIC"]!!

    private val grupperingsId = env["BRUKERNOTIFIKASJON_KAFKA_GROUP_ID"]
    private val namespace = "etterlatte"
    private val appname = "etterlatte-notifikasjoner"
    private val sikkerhetsNivaa = 4
    private val eksternVarsling = false

    fun sendMessage(soeknad: InnsendtSoeknad) {
        val innsender = soeknad.innsender.foedselsnummer.svar.value
        val soeker = soeknad.soeker.foedselsnummer!!.svar.value

        if (innsender != soeker) {
            send(opprettNokkel(innsender), opprettBeskjed(soeknad))
        }

        send(opprettNokkel(soeker), opprettBeskjed(soeknad))
    }

    internal fun opprettBeskjed(soeknad: InnsendtSoeknad): BeskjedInput {
        val now = LocalDateTime.now(ZoneOffset.UTC)
        val weekFromNow = now.plusDays(7)
        val tekst = when (soeknad.type) {
            SoeknadType.GJENLEVENDEPENSJON -> "Vi har mottatt søknaden din om gjenlevendepensjon"
            SoeknadType.BARNEPENSJON -> "Vi har mottatt søknaden din om barnepensjon"
        }

        return BeskjedInputBuilder()
            .withTidspunkt(LocalDateTime.now(ZoneOffset.UTC))
            .withTekst(tekst)
            .withSynligFremTil(weekFromNow)
            .withSikkerhetsnivaa(sikkerhetsNivaa)
            .withEksternVarsling(eksternVarsling)
            .build()
    }

    private fun opprettNokkel(ident: String) = NokkelInputBuilder()
        .withEventId(UUID.randomUUID().toString())
        .withGrupperingsId(grupperingsId)
        .withNamespace(namespace)
        .withAppnavn(appname)
        .withFodselsnummer(ident)
        .build()

    private fun send(nokkel: NokkelInput, beskjed: BeskjedInput) = try {
        producer.send(ProducerRecord(brukernotifikasjontopic, nokkel, beskjed)).get(10, TimeUnit.SECONDS)
    } catch (e: Exception) {
        logger.error(
            "Beskjed til $brukernotifikasjontopic (Ditt NAV) for søknad med id ${nokkel.getGrupperingsId()} feilet.",
            e
        )
    }
}
