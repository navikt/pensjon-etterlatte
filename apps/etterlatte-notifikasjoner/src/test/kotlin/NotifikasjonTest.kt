import io.mockk.mockk
import no.nav.brukernotifikasjon.schemas.input.BeskjedInput
import no.nav.brukernotifikasjon.schemas.input.NokkelInput
import no.nav.common.JAASCredential
import no.nav.common.KafkaEnvironment
import no.nav.etterlatte.Notifikasjon
import no.nav.etterlatte.SendNotifikasjon
import no.nav.helse.rapids_rivers.JsonMessage
import no.nav.helse.rapids_rivers.testsupport.TestRapid
import org.apache.kafka.clients.producer.MockProducer
import org.apache.kafka.clients.producer.Producer
import org.junit.jupiter.api.AfterAll
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.BeforeAll
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.TestInstance
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

    @Test
    fun `Skal legge bekreftelsesmelding på køen når notifikasjon er sendt`() {

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
    }

    @AfterAll
    fun tearDown() {
        embeddedKafkaEnvironment.tearDown()
    }
}
