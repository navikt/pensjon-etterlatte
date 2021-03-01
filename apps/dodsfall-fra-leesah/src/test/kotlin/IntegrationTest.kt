import io.confluent.kafka.serializers.KafkaAvroSerializer
import io.ktor.utils.io.*
import no.nav.common.JAASCredential
import no.nav.common.KafkaEnvironment
import no.nav.etterlatte.Dodsmeldinger
import no.nav.etterlatte.FinnDodsmeldinger
import no.nav.etterlatte.TestConfig
import no.nav.etterlatte.leesah.LivetErEnStroemAvHendelser
import no.nav.person.pdl.leesah.Endringstype
import no.nav.person.pdl.leesah.Personhendelse
import no.nav.person.pdl.leesah.adressebeskyttelse.Adressebeskyttelse
import org.apache.kafka.clients.CommonClientConfigs
import org.apache.kafka.clients.consumer.ConsumerConfig
import org.apache.kafka.clients.consumer.KafkaConsumer
import org.apache.kafka.clients.producer.KafkaProducer
import org.apache.kafka.clients.producer.ProducerConfig
import org.apache.kafka.clients.producer.ProducerRecord
import org.apache.kafka.common.config.SslConfigs
import org.apache.kafka.common.security.auth.SecurityProtocol
import org.apache.kafka.common.serialization.StringDeserializer
import org.apache.kafka.common.serialization.StringSerializer
import org.junit.jupiter.api.AfterAll
import org.junit.jupiter.api.BeforeAll
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.fail
import java.time.Duration
import java.time.Instant
import kotlin.test.assertEquals

class IntegrationTest {
companion object{
    val kafkaEnv = KafkaEnvironment(
            noOfBrokers = 1,
            topicNames = listOf("etterlatte.dodsmelding", "aapen-person-pdl-leesah-v1"),
            withSecurity = false,
            //users = listOf(JAASCredential("myP1", "myP1p"),JAASCredential("myC1", "myC1p")),
            autoStart = true,
            withSchemaRegistry = true
    )
    @AfterAll
    fun teardown(){
        kafkaEnv.tearDown()
    }
}

    @Test
    fun test(){

        val p:KafkaProducer<String, Personhendelse> = KafkaProducer(mapOf(
                ProducerConfig.BOOTSTRAP_SERVERS_CONFIG to kafkaEnv.brokersURL,
                ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG to KafkaAvroSerializer::class.java.canonicalName,
                ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG to KafkaAvroSerializer::class.java.canonicalName,
                "schema.registry.url" to kafkaEnv.schemaRegistry?.url ,
                ProducerConfig.ACKS_CONFIG to "all",
        ))

        val c: KafkaConsumer<String, String> = KafkaConsumer(mapOf(
                ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG to kafkaEnv.brokersURL,
                ConsumerConfig.GROUP_ID_CONFIG to "test",
                ConsumerConfig.AUTO_OFFSET_RESET_CONFIG to "earliest",
                ConsumerConfig.ENABLE_AUTO_COMMIT_CONFIG to "false",
                ConsumerConfig.MAX_POLL_RECORDS_CONFIG to "10",
                ConsumerConfig.MAX_POLL_INTERVAL_MS_CONFIG to  "100"
        ), StringDeserializer(), StringDeserializer())


        val app = FinnDodsmeldinger(LivetErEnStroemAvHendelser(mapOf(
                "LEESAH_KAFKA_BROKERS" to kafkaEnv.brokersURL,
                "LEESAH_KAFKA_GROUP_ID" to "leesah-consumer",
                "LEESAH_KAFKA_SCHEMA_REGISTRY" to kafkaEnv.schemaRegistry?.url!!
        )), Dodsmeldinger(TestConfig(true, mapOf("KAFKA_BROKERS" to kafkaEnv.brokersURL))))
        c.subscribe(listOf("etterlatte.dodsmelding"))
        app.stream()

        p.send(ProducerRecord("aapen-person-pdl-leesah-v1", Personhendelse("1", listOf("Lars"), "", Instant.now(), "DOEDSFALL_V1", Endringstype.OPPRETTET, null, null, null, null, null, null, null, null, null))).get()
        app.stream()


        c.poll(Duration.ofSeconds(4L)).apply {
            assertEquals(1, this.count())
        }.forEach{
            assertEquals("{\"system_read_count\":0,\"@event_name\":\"person_dod\",\"@ident\":\"Lars\"}", it.value())
        }


    }



}