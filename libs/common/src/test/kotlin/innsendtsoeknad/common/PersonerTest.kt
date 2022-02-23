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
    fun `Serde av verge fungerer med nullable felter`() {
        val verge = Verge(
            fornavn = Opplysning("Fornavn"),
        )

        val serialized = mapper.writeValueAsString(verge)

        val deserialized = mapper.readValue(serialized, jacksonTypeRef<Person>())

        (deserialized is Verge) shouldBe true
        deserialized.fornavn shouldBe verge.fornavn
        deserialized.etternavn shouldBe null
        deserialized.foedselsnummer shouldBe null
    }

    @Test
    fun `Deserialisering av barn fungerer`() {
        val barnJson = """{"type":"BARN","fornavn":{"spoersmaal":"Fornavn","svar":"Blåøyd"},"etternavn":{"spoersmaal":"Etternavn","svar":"Saks"},"foedselsnummer":{"spoersmaal":"Barnets fødselsnummer / d-nummer","svar":"09011350027"},"statsborgerskap":{"spoersmaal":"Statsborgerskap","svar":"Norge"},"utenlandsAdresse":{"spoersmaal":"Bor barnet i et annet land enn Norge?","svar":{"verdi":"JA","innhold":"Ja"},"opplysning":{"land":{"spoersmaal":"Land","svar":{"innhold":"Polen"}},"adresse":{"spoersmaal":"Adresse i utlandet","svar":{"innhold":"Polski gatski 13"}}}},"foreldre":[{"type":"FORELDER","fornavn":{"spoersmaal":"Fornavn","svar":"STOR"},"etternavn":{"spoersmaal":"Etternavn","svar":"SNERK"},"foedselsnummer":{"spoersmaal":"Fødselsnummer","svar":"11057523044"}},{"type":"FORELDER","fornavn":{"spoersmaal":"Fornavn","svar":"Polski"},"etternavn":{"spoersmaal":"Etternavn","svar":"Dødski"},"foedselsnummer":{"spoersmaal":"Fødselsnummer","svar":"26104500284"}}],"verge":{"spoersmaal":"Er det oppnevnt en verge for barnet?","svar":{"verdi":"JA","innhold":"Ja"},"opplysning":{"type":"VERGE","fornavn":{"spoersmaal":"Fornavn","svar":"Verg"},"etternavn":{"spoersmaal":"Etternavn","svar":"Vikernes"},"foedselsnummer":{"spoersmaal":"Fødselsnummer","svar":"30106519672"}}}}"""

        val deserialized = mapper.readValue(barnJson, jacksonTypeRef<Person>())

        (deserialized as Barn) shouldNotBe null
        deserialized.fornavn.svar shouldBe "Blåøyd"
        deserialized.etternavn.svar shouldBe "Saks"
        deserialized.foedselsnummer.svar.value shouldBe "09011350027"

        deserialized.foreldre.size shouldBe 2
        deserialized.dagligOmsorg?.svar shouldBe null
        deserialized.statsborgerskap.svar shouldBe "Norge"
        deserialized.utenlandsAdresse!!.svar.verdi shouldBe JaNeiVetIkke.JA
    }

}
