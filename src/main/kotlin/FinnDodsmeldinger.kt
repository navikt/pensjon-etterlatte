package no.pensjon

class FinnDodsmeldinger(val config:AppConfig) {
    var iterasjoner = 0
    var dodsmeldinger = 0
    var meldinger = 0

    val livshendelser = LivetErEnStroemAvHendelser(config)
    val dodshendelser = if(config.enableKafka) Dodsmeldinger(config) else null


    fun stream(){
        iterasjoner++
        livshendelser.poll {
            meldinger++
            if(it.getOpplysningstype()== "DOEDSFALL_V1") {
                dodshendelser?.personErDod(it.getPersonidenter().get(0))
                dodsmeldinger++
            }
        }
    }


}