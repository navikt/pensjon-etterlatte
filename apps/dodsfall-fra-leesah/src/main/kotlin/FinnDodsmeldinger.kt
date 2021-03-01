package no.nav.etterlatte
import no.nav.etterlatte.leesah.ILivetErEnStroemAvHendelser

class FinnDodsmeldinger(private val livshendelser: ILivetErEnStroemAvHendelser, private val dodshendelser:IDodsmeldinger) {
    var iterasjoner = 0
    var dodsmeldinger = 0
    var meldinger = 0


    fun stream(){
        iterasjoner++
        livshendelser.poll {
            meldinger++
            if(it.getOpplysningstype()== "DOEDSFALL_V1") {
                dodshendelser.personErDod(it.getPersonidenter()[0])
                dodsmeldinger++
            }
        }
    }

    fun fraStart(){
        livshendelser.fraStart()
    }


}