package common

import tools.jackson.databind.DeserializationFeature
import tools.jackson.databind.cfg.EnumFeature
import tools.jackson.databind.module.SimpleModule
import tools.jackson.module.kotlin.KotlinInvalidNullException
import tools.jackson.module.kotlin.jacksonMapperBuilder
import tools.jackson.module.kotlin.readValue
import io.kotest.assertions.throwables.shouldThrow
import io.kotest.matchers.shouldBe
import no.nav.etterlatte.common.LocalDateSerializer
import org.junit.jupiter.api.Test
import java.time.LocalDate

internal class LocalDateSerializerTest {
    private data class TestClassOptionalDate(
        val date: LocalDate?,
    )

    private data class TestClassRequiredDate(
        val date: LocalDate,
    )

    private val jacksonObjectMapper =
        jacksonMapperBuilder()
            .enable(EnumFeature.READ_UNKNOWN_ENUM_VALUES_AS_NULL)
            .disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES)
            .addModule(SimpleModule().addDeserializer(LocalDate::class.java, LocalDateSerializer()))
            .build()

    @Test
    fun `Ved konvertering av UTC string til LocalDate skal vi benytte norsk tidssone`() {
        val testClassRequiredDate: TestClassRequiredDate =
            jacksonObjectMapper.readValue("""{"date":"2001-07-26T22:00:00.000Z"}""")
        val testClassOptionalDate: TestClassOptionalDate =
            jacksonObjectMapper.readValue("""{"date":"2001-07-26T22:00:00.000Z"}""")

        jacksonObjectMapper.writeValueAsString(testClassRequiredDate) shouldBe """{"date":"2001-07-27"}"""
        jacksonObjectMapper.writeValueAsString(testClassOptionalDate) shouldBe """{"date":"2001-07-27"}"""
    }

    @Test
    fun `Skal klare å deserialisere vanlig LocaDate format`() {
        val testClassOptionalDate: TestClassOptionalDate = jacksonObjectMapper.readValue("""{"date":"2001-07-27"}""")

        jacksonObjectMapper.writeValueAsString(testClassOptionalDate) shouldBe """{"date":"2001-07-27"}"""
    }

    @Test
    fun `Skal håndtere nullverdier hvis feltet er optional`() {
        val testClassOptionalDateMissing: TestClassOptionalDate = jacksonObjectMapper.readValue("""{}""")
        val testClassOptionalDateNull: TestClassOptionalDate = jacksonObjectMapper.readValue("""{"date":null}""")
        val testClassOptionalDateEmptyString: TestClassOptionalDate = jacksonObjectMapper.readValue("""{"date":""}""")

        testClassOptionalDateMissing.date shouldBe null
        testClassOptionalDateNull.date shouldBe null
        testClassOptionalDateEmptyString.date shouldBe null
    }

    @Test
    fun `Skal kaste feil hvis feltet ikke er optional`() {
        shouldThrow<KotlinInvalidNullException> {
            jacksonObjectMapper.readValue<TestClassRequiredDate>("""{"date":null}""")
        }
    }
}