package no.nav.etterlatte

import no.nav.brukernotifikasjon.schemas.builders.BeskjedInputBuilder
import no.nav.brukernotifikasjon.schemas.builders.NokkelInputBuilder
import no.nav.brukernotifikasjon.schemas.input.BeskjedInput
import no.nav.brukernotifikasjon.schemas.input.NokkelInput

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

    // notifikasjon
    private val notifikasjonsTekst = "Vi har mottatt søknaden din om gjenlevendepensjon"
    private val grupperingsId = env["BRUKERNOTIFIKASJON_KAFKA_GROUP_ID"]

    private val namespace = "etterlatte"
    private val appname = "etterlatte-notifikasjoner"

    // opprettNotifikasjon
    private val sikkerhetsNivaa = 4
    private val eksternVarsling = false

    fun sendMessage(ident: String) {
        val nokkel = NokkelInputBuilder()
            .withEventId(UUID.randomUUID().toString())
            .withFodselsnummer(ident)
            .withGrupperingsId(grupperingsId)
            .withNamespace(namespace)
            .withAppnavn(appname)
            .build()
        val beskjed = opprettBeskjed()
        try {
            producer.send(ProducerRecord(brukernotifikasjontopic, nokkel, beskjed)).get(10, TimeUnit.SECONDS)
        }catch (e: Exception){
            logger.error(
                "Beskjed til $brukernotifikasjontopic (Ditt NAV) for søknad med id ${nokkel.getGrupperingsId()} feilet.",
                e
            )
        }

    }

    internal fun opprettBeskjed(): BeskjedInput {
        val now = LocalDateTime.now(ZoneOffset.UTC)
        val weekFromNow = now.plusDays(7)

        return BeskjedInputBuilder()
            .withTidspunkt(LocalDateTime.now(ZoneOffset.UTC))
            .withTekst(notifikasjonsTekst)
            .withSynligFremTil(weekFromNow)
            .withSikkerhetsnivaa(sikkerhetsNivaa)
            .withEksternVarsling(eksternVarsling)
            .build()
    }
}
