package no.nav.etterlatte

//import no.nav.brukernotifikasjon.schemas.Beskjed
//import no.nav.brukernotifikasjon.schemas.Nokkel
//import no.nav.brukernotifikasjon.schemas.builders.BeskjedBuilder
//import no.nav.brukernotifikasjon.schemas.builders.NokkelBuilder
import no.nav.brukernotifikasjon.schemas.builders.BeskjedInputBuilder
import no.nav.brukernotifikasjon.schemas.builders.NokkelInputBuilder
import no.nav.brukernotifikasjon.schemas.input.BeskjedInput
import no.nav.brukernotifikasjon.schemas.input.NokkelInput

import org.apache.kafka.clients.producer.KafkaProducer
import org.apache.kafka.clients.producer.Producer
import org.apache.kafka.clients.producer.ProducerRecord
import java.net.InetAddress
import java.time.LocalDateTime
import java.time.ZoneOffset
import java.util.*
import java.util.concurrent.TimeUnit

class SendNotifikasjon(env: Map<String, String>) {

    private val brukernotifikasjontopic = env["BRUKERNOTIFIKASJON_BESKJED_TOPIC"]!!

    private var producer: Producer<NokkelInput, BeskjedInput> = KafkaProducer(KafkaConfig().producerConfig(env))

    //Producer
    private val env = env

    // notifikasjon
    private val notifikasjonsTekst = "Vi har mottatt søknaden din om gjenlevendepensjon"
    private val grupperingsId = env["BRUKERNOTIFIKASJON_KAFKA_GROUP_ID"]

    private val namespace = env["NAIS_NAMESPACE"]
    private val appname = env["NAIS_NAME"]

    // opprettNotifikasjon
    private val sikkerhetsNivaa = 4
    private val eksternVarsling = false


    fun startuptask() {
        producer = KafkaProducer(
            KafkaConfig(
            ).producerConfig(env)
        )
    }

    fun sendMessage(ident: String) {
        val nokkel = NokkelInputBuilder()
            .withEventId(UUID.randomUUID().toString())
            .withFodselsnummer(ident)
            .withGrupperingsId(grupperingsId)
            .withNamespace(namespace)
            .withAppnavn(appname)
            .build()
        val beskjed = opprettBeskjed()

        producer.send(ProducerRecord(brukernotifikasjontopic, nokkel, beskjed)).get(10, TimeUnit.SECONDS)
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
