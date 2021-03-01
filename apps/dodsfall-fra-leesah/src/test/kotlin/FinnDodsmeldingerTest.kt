import no.nav.person.pdl.leesah.Personhendelse
import no.nav.etterlatte.FinnDodsmeldinger
import no.nav.etterlatte.IDodsmeldinger

import no.nav.etterlatte.leesah.ILivetErEnStroemAvHendelser
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.Assertions.fail
import org.junit.jupiter.api.Assertions.assertEquals


internal class FinnDodsmeldingerTest {

    @Test
    fun ikkeDodsmelding() {
        val subject = FinnDodsmeldinger(LeesahMock(listOf(Personhendelse().apply{put("opplysningstype", "Ikke dodsmelding")})), DodsMock{fail()})
        subject.stream()
    }

    @Test
    fun dodsmelding() {
        val dodsmeldinger = mutableListOf<String>()
        val subject = FinnDodsmeldinger(LeesahMock(listOf(Personhendelse().apply{
            put("opplysningstype", "DOEDSFALL_V1")
            put("personidenter", listOf("123"))
            })), DodsMock{dodsmeldinger += it})
        subject.stream()
        assertEquals(1, dodsmeldinger.size)
        assertEquals("123", dodsmeldinger[0])
    }
}

class LeesahMock(val moccData:List<Personhendelse>) : ILivetErEnStroemAvHendelser {
    override fun poll(c: (Personhendelse) -> Unit): Int {
        moccData.forEach(c)
        return 1
    }

    override fun fraStart() {

    }
}

class DodsMock(val c:(String)->Unit): IDodsmeldinger {
    override fun personErDod(ident: String) = c(ident)

}
