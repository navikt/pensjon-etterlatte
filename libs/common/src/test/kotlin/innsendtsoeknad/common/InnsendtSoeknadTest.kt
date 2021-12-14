package innsendtsoeknad.common

import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.fasterxml.jackson.module.kotlin.jacksonTypeRef
import io.kotest.matchers.ints.shouldBeExactly
import io.kotest.matchers.shouldBe
import no.nav.etterlatte.libs.common.innsendtsoeknad.common.SoeknadRequest
import org.junit.jupiter.api.Test

internal class InnsendtSoeknadTest {

    private val mapper = jacksonObjectMapper()
        .registerModule(JavaTimeModule())

    @Test
    fun `Deserialisering fungerer som forventet`() {
        val json = """{"soeknader":[{"type":"GJENLEVENDEPENSJON","imageTag":"j9482hjf98h34","harSamtykket":{"spoersmaal":"Jeg, , bekrefter at jeg vil gi riktige og fullstendige opplysninger.","svar":true},"innsender":{"type":"INNSENDER","fornavn":"VAKKER","etternavn":"PENN","foedselsnummer":"09038520129"},"utbetalingsInformasjon":{"spoersmaal":"Ønsker du å motta utbetalingen på norsk eller utenlandsk bankkonto?","svar":"NORSK","opplysning":{"kontonummer":{"spoersmaal":"Oppgi norsk kontonummer for utbetaling","svar":"9988.77.66554"}}},"soeker":{"type":"GJENLEVENDE","fornavn":"VAKKER","etternavn":"PENN","foedselsnummer":"09038520129","statsborgerskap":"Norge","sivilstatus":"UOPPGITT","adresse":{"spoersmaal":"Bostedsadresse","svar":"Sannergata"},"bostedsAdresse":{"spoersmaal":"Bor du på denne adressen?","svar":"JA"},"kontaktinfo":{"epost":{"spoersmaal":"E-post","svar":"meg.selv@heim.no"},"telefonnummer":{"spoersmaal":"Telefonnummer","svar":"998 87 766"}},"oppholdUtland":{"spoersmaal":"Oppholder du deg for tiden i Norge?","svar":"JA"},"nySivilstatus":{"spoersmaal":"Sivilstanden din i dag","svar":"INGEN"},"arbeidOgUtdanning":{"dinSituasjon":{"spoersmaal":"Hva er situasjonen din nå?","svar":["SELVSTENDIG"]},"selvstendig":{"spoersmaal":"Om næringen","svar":[{"firmanavn":{"spoersmaal":"Om næringen","svar":"Mitt Arkitektfirma ANS"},"orgnr":{"spoersmaal":"Organisasjonsnummer","svar":"112233445"},"endretInntekt":{"spoersmaal":"Regner du med at inntekten din endrer seg de neste 12 månedene?","svar":"NEI","opplysning":{"spoersmaal":"Hva er grunnen til endringene?","svar":"undefined"}}}]}},"fullfoertUtdanning":{"spoersmaal":"Hva er din høyeste fullførte utdanning?","svar":"UNIVERSITET_OVER_4_AAR"},"andreYtelser":{"kravOmAnnenStonad":{"spoersmaal":"Har du søkt om andre ytelser som du ikke har fått svar på?","svar":"JA","opplysning":{"spoersmaal":"Hva har du søkt om?","svar":"SYKEPENGER"}},"annenPensjon":{"spoersmaal":"Får du eller har du søkt om avtalefestet pensjon (AFP) eller annen pensjon fra andre enn NAV?","svar":"NEI","opplysning":{"spoersmaal":"Hvilken pensjonsordning?","svar":"undefined"}},"pensjonUtland":{"spoersmaal":"Mottar du pensjon fra et annet land enn Norge?","svar":"NEI","opplysning":{"pensjonsType":{"spoersmaal":"Hva slags pensjon?","svar":"undefined"},"land":{"spoersmaal":"Fra hvilket land?","svar":"undefined"},"bruttobeloepPrAar":{"spoersmaal":"Årlig beløp før skatt i landets valuta","svar":"undefined"}}}},"uregistrertEllerVenterBarn":{"spoersmaal":"Venter du barn eller har du barn som enda ikke er registrert i folkeregisteret?","svar":"NEI"},"forholdTilAvdoede":{"relasjon":{"spoersmaal":"Relasjonen din til avdøde da dødsfallet skjedde","svar":"SAMBOER"},"fellesBarn":{"spoersmaal":"Har eller hadde dere felles barn?","svar":"JA"}}},"avdoed":{"type":"AVDOED","fornavn":"Artig","etternavn":"Floskel","foedselsnummer":"06048010820","datoForDoedsfallet":{"spoersmaal":"Når skjedde dødsfallet?","svar":"2021-04-18T22:00:00.000Z"},"statsborgerskap":{"spoersmaal":"Statsborgerskap","svar":"Norge"},"utenlandsopphold":{"spoersmaal":"Bodde eller arbeidet han eller hun i et annet land enn Norge etter fylte 16 år?","svar":"NEI"},"naeringsInntekt":{"spoersmaal":"Var han eller hun selvstendig næringsdrivende?","svar":"NEI"},"militaertjeneste":{"spoersmaal":"Har han eller hun gjennomført militær eller sivil førstegangstjeneste som varte minst 30 dager?","svar":"NEI"},"doedsaarsakSkyldesYrkesskadeEllerYrkessykdom":{"spoersmaal":"Skyldes dødsfallet yrkesskade eller yrkessykdom?","svar":"NEI"}},"barn":[{"type":"BARN","fornavn":"Cati","etternavn":"Floskel","foedselsnummer":"09011350027","statsborgerskap":{"spoersmaal":"Statsborgerskap","svar":"Norge"},"utenlandsAdresse":{"spoersmaal":"Bor barnet i et annet land enn Norge?","svar":"NEI"},"foreldre":[{"type":"FORELDER","fornavn":"VAKKER","etternavn":"PENN","foedselsnummer":"09038520129"},{"type":"FORELDER","fornavn":"Artig","etternavn":"Floskel","foedselsnummer":"06048010820"}],"verge":{"spoersmaal":"Er det oppnevnt en verge for barnet?","svar":"NEI"}}]},{"type":"BARNEPENSJON","imageTag":"j9482hjf98h34","innsender":{"type":"INNSENDER","fornavn":"VAKKER","etternavn":"PENN","foedselsnummer":"09038520129"},"harSamtykket":{"spoersmaal":"","svar":true},"utbetalingsInformasjon":{"spoersmaal":"Ønsker du å motta utbetalingen på norsk eller utenlandsk bankkonto?","svar":"NORSK","opplysning":{"kontonummer":{"spoersmaal":"Oppgi norsk kontonummer for utbetaling","svar":"9988.77.66554"}}},"soeker":{"type":"BARN","fornavn":"Cati","etternavn":"Floskel","foedselsnummer":"09011350027","statsborgerskap":{"spoersmaal":"Statsborgerskap","svar":"Norge"},"utenlandsAdresse":{"spoersmaal":"Bor barnet i et annet land enn Norge?","svar":"NEI"},"foreldre":[{"type":"FORELDER","fornavn":"VAKKER","etternavn":"PENN","foedselsnummer":"09038520129"},{"type":"FORELDER","fornavn":"Artig","etternavn":"Floskel","foedselsnummer":"06048010820"}],"verge":{"spoersmaal":"Er det oppnevnt en verge for barnet?","svar":"NEI"}},"foreldre":[{"type":"FORELDER","fornavn":"VAKKER","etternavn":"PENN","foedselsnummer":"09038520129"},{"type":"FORELDER","fornavn":"Artig","etternavn":"Floskel","foedselsnummer":"06048010820"}],"soesken":[]}]}"""

        val deserialized = mapper.readValue(json, jacksonTypeRef<SoeknadRequest>())

        deserialized.soeknader.size shouldBeExactly 2

        val gjenlevendepensjon = deserialized.soeknader.first()
        gjenlevendepensjon.type shouldBe SoeknadType.GJENLEVENDEPENSJON
        gjenlevendepensjon.template() shouldBe "gjenlevendepensjon_v1"

        val barnepensjon = deserialized.soeknader.last()
        barnepensjon.type shouldBe SoeknadType.BARNEPENSJON
        barnepensjon.template() shouldBe "barnepensjon_v1"
    }
}
