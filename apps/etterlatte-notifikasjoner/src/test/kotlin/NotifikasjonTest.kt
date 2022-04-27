import io.mockk.mockk
import no.nav.brukernotifikasjon.schemas.input.BeskjedInput
import no.nav.brukernotifikasjon.schemas.input.NokkelInput
import no.nav.common.JAASCredential
import no.nav.common.KafkaEnvironment
import no.nav.etterlatte.Notifikasjon
import no.nav.etterlatte.SendNotifikasjon
import no.nav.etterlatte.mapper
import no.nav.helse.rapids_rivers.JsonMessage
import no.nav.helse.rapids_rivers.testsupport.TestRapid
import org.apache.kafka.clients.producer.MockProducer
import org.junit.jupiter.api.AfterAll
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.BeforeAll
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.TestInstance
import soeknad.InnsendtSoeknadFixtures
import java.util.*

@TestInstance(TestInstance.Lifecycle.PER_CLASS)
internal class NotifikasjonTest {
    private val topicname: String = "test_topic"
    private val user = "srvkafkaclient"
    private val pass = "kafkaclient"
    private val mockKafkaProducer =
        MockProducer<NokkelInput, BeskjedInput>(true, mockk(relaxed = true), mockk(relaxed = true))
    private val sendMelding = SendNotifikasjon(
        mapOf(
            "BRUKERNOTIFIKASJON_BESKJED_TOPIC" to "test_topic",
            "BRUKERNOTIFIKASJON_KAFKA_GROUP_ID" to "bah",
            "NAIS_NAMESPACE" to "etterlatte",
            "NAIS_NAME" to "etterlatte-notifikasjoner"
        ), mockKafkaProducer
    )
    private val embeddedKafkaEnvironment = KafkaEnvironment(
        autoStart = false,
        noOfBrokers = 1,
        topicInfos = listOf(KafkaEnvironment.TopicInfo(name = topicname, partitions = 1)),
        withSchemaRegistry = true,
        withSecurity = true,

        users = listOf(JAASCredential(user, pass)),
        brokerConfigOverrides = Properties().apply {
            this["auto.leader.rebalance.enable"] = "false"
            this["group.initial.rebalance.delay.ms"] =
                "1" //Avoid waiting for new consumers to join group before first rebalancing (default 3000ms)
        }
    )

    @BeforeAll
    fun setUp() {
        embeddedKafkaEnvironment.start()
        embeddedKafkaEnvironment.withSecurity
    }

    @BeforeEach
    fun before() {
        mockKafkaProducer.clear()
    }

    @Test
    fun `Skal opprette notifikasjon til innsender ved innsending av gjenlevendepensjon`() {
        val soeknad: String = mapper.writeValueAsString(InnsendtSoeknadFixtures.gjenlevendepensjon())
        val inspector = TestRapid()
            .apply {
                Notifikasjon(
                    sendMelding,
                    this
                )
            }
            .apply {
                sendTestMessage(
                    JsonMessage.newMessage(
                        mapOf(
                            "@event_name" to "soeknad_innsendt",
                            "@dokarkivRetur" to "123456",
                            "@fnr_soeker" to "07106123912",
                            "@skjema_info" to mapper.readTree(soeknad),
                            "@lagret_soeknad_id" to "4",
                            "@dokarkivRetur" to (mapOf("journalpostId" to "3"))
                        )
                    )
                        .toJson()
                )
            }.inspektør

        assertEquals("notifikasjon_sendt", inspector.message(0).get("@event_name").asText())
        assertEquals("Notifikasjon sendt", inspector.message(0).get("@notifikasjon").asText())
        assertEquals("3", inspector.message(0).get("@journalpostId").asText())
        assertEquals("4", inspector.message(0).get("@lagret_soeknad_id").asText())
        assertEquals("SendNotifikasjon 3", inspector.key(0))
        assertEquals(mockKafkaProducer.history().size, 1)
        assertEquals(
            mockKafkaProducer.history()[0].value().getTekst(),
            "Vi har mottatt søknaden din om gjenlevendepensjon"
        )
        assertEquals(
            InnsendtSoeknadFixtures.gjenlevendepensjon().innsender.foedselsnummer.svar.value,
            mockKafkaProducer.history()[0].key().getFodselsnummer()
        )
    }

    @Test
    fun `Skal opprette notifikasjon til innsender ved innsending av barnepensjon`() {
        val soeknad: String = mapper.writeValueAsString(InnsendtSoeknadFixtures.barnepensjon())
        val inspector = TestRapid()
            .apply {
                Notifikasjon(
                    sendMelding,
                    this
                )
            }
            .apply {
                sendTestMessage(
                    JsonMessage.newMessage(
                        mapOf(
                            "@event_name" to "soeknad_innsendt",
                            "@dokarkivRetur" to "123456",
                            "@fnr_soeker" to "07106123912",
                            "@skjema_info" to mapper.readTree(soeknad),
                            "@lagret_soeknad_id" to "4",
                            "@dokarkivRetur" to (mapOf("journalpostId" to "5"))
                        )
                    )
                        .toJson()
                )
            }.inspektør

        assertEquals("notifikasjon_sendt", inspector.message(0).get("@event_name").asText())
        assertEquals("Notifikasjon sendt", inspector.message(0).get("@notifikasjon").asText())
        assertEquals("5", inspector.message(0).get("@journalpostId").asText())
        assertEquals("4", inspector.message(0).get("@lagret_soeknad_id").asText())
        assertEquals("SendNotifikasjon 5", inspector.key(0))
        assertEquals(mockKafkaProducer.history().size, 1)
        assertEquals(mockKafkaProducer.history()[0].value().getTekst(), "Vi har mottatt søknaden din om barnepensjon")
        assertEquals(
            InnsendtSoeknadFixtures.barnepensjon().innsender.foedselsnummer.svar.value,
            mockKafkaProducer.history()[0].key().getFodselsnummer()
        )
    }

    @AfterAll
    fun tearDown() {
        embeddedKafkaEnvironment.tearDown()
    }
}
