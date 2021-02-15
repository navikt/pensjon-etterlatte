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
        val subject = FinnDodsmeldinger(LeesahMock(listOf(Personhendelse().apply{opplysningstype = "Ikke dodsmelding"})), DodsMock{fail()})
        subject.stream()
    }

    @Test
    fun dodsmelding() {
        val dødsmeldinger = mutableListOf<String>()
        val subject = FinnDodsmeldinger(LeesahMock(listOf(Personhendelse().apply{
            opplysningstype = "DOEDSFALL_V1";
            setPersonidenter(listOf("123"))})), DodsMock{dødsmeldinger += it})
        subject.stream()
        assertEquals(1, dødsmeldinger.size)
        assertEquals("123", dødsmeldinger[0])
    }
}

class LeesahMock(val moccData:List<Personhendelse>) : ILivetErEnStroemAvHendelser {
    override fun poll(c: (Personhendelse) -> Unit): Int {
        moccData.forEach(c)
        return 1
    }
}

class DodsMock(val c:(String)->Unit): IDodsmeldinger {
    override fun personErDod(ident: String) = c(ident)

}
