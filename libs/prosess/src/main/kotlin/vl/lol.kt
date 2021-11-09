package lol

import vl.prosess.ProcessSteg
import vl.prosess.StartetBehandling

object Opprett
object med
object opprett_behandling_med
object kjør

infix fun Opprett.behandling(l: med) = opprett_behandling_med
infix fun opprett_behandling_med.bruker(fnr: String) = StartetBehandling(fnr)
infix fun StartetBehandling.så(l: kjør) = this
infix fun <T> StartetBehandling.gjennom(prosess: ProcessSteg<StartetBehandling, T>) = prosess(this)
