package no.nav.etterlatte

import no.nav.common.JAASCredential
import no.nav.common.KafkaEnvironment
import no.nav.helse.rapids_rivers.JsonMessage
import no.nav.helse.rapids_rivers.testsupport.TestRapid
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.Test

internal class NotifikasjonTest {


    private val topicname: String = "test_topic"
    private val user = "srvkafkaclient"
    private val pass = "kafkaclient"
    private val embeddedKafkaEnvironment = KafkaEnvironment(
        autoStart = false,
        noOfBrokers = 1,
        topicInfos = listOf(KafkaEnvironment.TopicInfo(name = topicname, partitions = 1)),
        withSchemaRegistry = true,
        withSecurity = true,
        users = listOf(JAASCredential(user, pass)),
        //brokerConfigOverrides = Properties().apply {
        //    this["auto.leader.rebalance.enable"] = "false"
         //   this["group.initial.rebalance.delay.ms"] = "1" //Avoid waiting for new consumers to join group before first rebalancing (default 3000ms)
        //}
    )


    @Test
    fun test1() {
        embeddedKafkaEnvironment.start()
        val inspector = TestRapid()
            .apply { Notifikasjon(mapOf(
                Pair("BRUKERNOTIFIKASJON_BESKJED_TOPIC", topicname),
                Pair("BRUKERNOTIFIKASJON_KAFKA_BROKERS", embeddedKafkaEnvironment.brokersURL.substringAfterLast("/")),
                Pair("NAIS_APP_NAME","etterlatte-notifikasjoner"),
                Pair("srvuser",user),
                Pair("srvpwd",pass),
                Pair("BRUKERNOTIFIKASJON_KAFKA_SCHEMA_REGISTRY", embeddedKafkaEnvironment.schemaRegistry!!.url)
            ),
            this) }
            .apply {
                sendTestMessage(
                    JsonMessage.newMessage(
                        mapOf(
                            "@event_name" to "soeknad_innsendt",
                            "@dokarkivRetur" to "123456",
                            "@fnr_soeker" to "07106123912"
                        )
                    )
                        .toJson()
                )
            }.inspektør

        assertEquals("07106123912", inspector.message(0).get("@fnr_soeker").asText())
        assertEquals("Vi bekrefter å ha mottat din søknad om Etterlatteytelse", inspector.message(0).get("@notifikasjon").get("tekst").asText())
        assertEquals("", inspector.message(0).get("@notifikasjon").get("link").asText())
        assertEquals("ETTERLATTE", inspector.message(0).get("@notifikasjon").get("grupperingsId").asText())
        assertTrue(inspector.message(0).get("@notifikasjon").get("eksternVarsling").asBoolean())
        assertEquals("SMS", inspector.message(0).get("@notifikasjon").get("prefererteKanaler")[0].asText())
        embeddedKafkaEnvironment.tearDown()

    }
}
