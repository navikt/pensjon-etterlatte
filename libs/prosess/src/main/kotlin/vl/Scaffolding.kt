package no.nav.etterlatte.libs.common.vl.scaffolding

import lol.Opprett
import lol.behandling
import lol.bruker
import lol.gjennom
import lol.kjør
import lol.med
import lol.så
import vl.Blaze
import vl.Grunnlagsmotor
import vl.Vilkårsprøver
import vl.prosess.VedtaksProsess
import vl.prosess.startBehandling

val vedtakProsess = VedtaksProsess(Vilkårsprøver, Grunnlagsmotor, Blaze)
val medForLiteTrygdetid = "1"
val medNokTrygdetid = "2"
val medFullTrygdetid = "3"
val utenTrygdetid = "4"

fun main() {
    println("------------------------------------------------------------------------------------------------------")
    println(Opprett behandling med bruker medForLiteTrygdetid så kjør gjennom vedtakProsess)
    println("------------------------------------------------------------------------------------------------------")
    println(Opprett behandling med bruker medNokTrygdetid så kjør gjennom vedtakProsess)
    println("------------------------------------------------------------------------------------------------------")
    println(Opprett behandling med bruker medFullTrygdetid så kjør gjennom vedtakProsess)
    println("------------------------------------------------------------------------------------------------------")
    println(Opprett behandling med bruker utenTrygdetid så kjør gjennom vedtakProsess)
}

fun main2() {
    println(vedtakProsess(startBehandling(medNokTrygdetid)).opplysningerSomMåAttesteres().distinct())
}