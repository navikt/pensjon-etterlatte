import io.confluent.kafka.serializers.KafkaAvroSerializer
import no.nav.common.KafkaEnvironment
import no.nav.etterlatte.DodsmeldingerRapid
import no.nav.etterlatte.FinnDodsmeldinger
import no.nav.etterlatte.leesah.LivetErEnStroemAvHendelser
import no.nav.helse.rapids_rivers.testsupport.TestRapid
import no.nav.person.pdl.leesah.Endringstype
import no.nav.person.pdl.leesah.Personhendelse
import org.apache.kafka.clients.producer.KafkaProducer
import org.apache.kafka.clients.producer.ProducerConfig
import org.apache.kafka.clients.producer.ProducerRecord
import org.junit.jupiter.api.AfterAll
import org.junit.jupiter.api.Test
import java.time.Instant
import kotlin.test.assertEquals

class IntegrationTest {
    companion object {
        val kafkaEnv = KafkaEnvironment(
            noOfBrokers = 1,
            topicNames = listOf("aapen-person-pdl-leesah-v1"),
            withSecurity = false,
            //users = listOf(JAASCredential("myP1", "myP1p"),JAASCredential("myC1", "myC1p")),
            autoStart = true,
            withSchemaRegistry = true
        )
        val rapid = TestRapid()

        @AfterAll
        @JvmStatic
        fun teardown() {
            kafkaEnv.tearDown()
        }
    }

    @Test
    fun test() {

        val leesahTopic: KafkaProducer<String, Personhendelse> = producerForLeesah()
        val app = testApp()

        app.stream()
        leesahTopic.send(
            ProducerRecord(
                "aapen-person-pdl-leesah-v1",
                Personhendelse(
                    "1",
                    listOf("1234567"),
                    "",
                    Instant.now(),
                    "DOEDSFALL_V1",
                    Endringstype.OPPRETTET,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null
                )
            )
        ).get()
        app.stream()

        rapid.inspektør.run {
            assertEquals(1, size)
            message(0)
        }.also { msg ->
            assertEquals("1234567", msg["@avdod_ident"].textValue())
            assertEquals("person_dod", msg["@event_name"].textValue())
            assertEquals(0, msg["system_read_count"].asInt())
        }
    }

    private fun testApp() = FinnDodsmeldinger(
        LivetErEnStroemAvHendelser(
            mapOf(
                "LEESAH_KAFKA_BROKERS" to kafkaEnv.brokersURL,
                "LEESAH_KAFKA_GROUP_ID" to "leesah-consumer",
                "LEESAH_KAFKA_SCHEMA_REGISTRY" to kafkaEnv.schemaRegistry?.url!!
            )
        ), DodsmeldingerRapid(rapid)
    )


    private fun producerForLeesah() = KafkaProducer<String, Personhendelse>(
        mapOf(
            ProducerConfig.BOOTSTRAP_SERVERS_CONFIG to kafkaEnv.brokersURL,
            ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG to KafkaAvroSerializer::class.java.canonicalName,
            ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG to KafkaAvroSerializer::class.java.canonicalName,
            "schema.registry.url" to kafkaEnv.schemaRegistry?.url,
            ProducerConfig.ACKS_CONFIG to "all",
        )
    )
}