package innsendtsoeknad.common

import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.fasterxml.jackson.module.kotlin.jacksonTypeRef
import io.kotest.matchers.shouldBe
import io.kotest.matchers.shouldNotBe
import no.nav.etterlatte.libs.common.innsendtsoeknad.common.Barn
import no.nav.etterlatte.libs.common.innsendtsoeknad.common.Person
import no.nav.etterlatte.libs.common.innsendtsoeknad.common.JaNeiVetIkke
import no.nav.etterlatte.libs.common.innsendtsoeknad.common.Opplysning
import no.nav.etterlatte.libs.common.innsendtsoeknad.common.Verge
import no.nav.etterlatte.libs.common.person.Foedselsnummer
import org.junit.jupiter.api.Test

internal class PersonerTest {

    private val mapper = jacksonObjectMapper()
        .registerModule(JavaTimeModule())

    @Test
    fun `Serde av verge fungerer`() {
        val verge = Verge(
            Opplysning("Fornavn"),
            Opplysning("Etternavn"),
            Opplysning(Foedselsnummer.of("24014021406"))
        )

        val serialized = mapper.writeValueAsString(verge)

        val deserialized = mapper.readValue(serialized, jacksonTypeRef<Person>())

        (deserialized is Verge) shouldBe true
        deserialized.fornavn shouldBe verge.fornavn
        deserialized.etternavn shouldBe verge.etternavn
        deserialized.foedselsnummer shouldBe verge.foedselsnummer
    }

    @Test
    fun `Deserialisering av barn fungerer`() {
        val barnJson = """{"type":"BARN","fornavn":"Blåøyd","etternavn":"Saks","foedselsnummer":"09011350027","statsborgerskap":{"spoersmaal":"Statsborgerskap","svar":"Norge"},"utenlandsAdresse":{"spoersmaal":"Bor barnet i et annet land enn Norge?","svar":"NEI"},"foreldre":[{"type":"FORELDER","fornavn":"VAKKER","etternavn":"PENN","foedselsnummer":"09038520129"},{"type":"FORELDER","fornavn":"Artig","etternavn":"Floskel","foedselsnummer":"06048010820"}],"verge":{"spoersmaal":"Er det oppnevnt en verge for barnet?","svar":"NEI"}}"""

        val deserialized = mapper.readValue(barnJson, jacksonTypeRef<Person>())

        (deserialized as Barn) shouldNotBe null
        deserialized.fornavn shouldBe "Blåøyd"
        deserialized.etternavn shouldBe "Saks"
        deserialized.foedselsnummer.svar.value shouldBe "09011350027"

        deserialized.foreldre.size shouldBe 2
        deserialized.dagligOmsorg shouldBe null
        deserialized.statsborgerskap.svar shouldBe "Norge"
        deserialized.utenlandsAdresse!!.svar shouldBe JaNeiVetIkke.NEI
    }

}
