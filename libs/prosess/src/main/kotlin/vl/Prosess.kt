package vl.prosess

import java.time.Instant
import java.util.*

interface VilkårsbrøvingService {
    fun grunnlagsbehov(): List<String>
    fun vilkårsprøv(grunnlag: List<Opplysning<out Any>>): Vilkårsprøving
}

interface GrunnlagService {
    fun innhentGrunnlag(fnr: String, grunnlagsBehov: List<String>): List<Opplysning<out Any>>
}

interface BeregningService {
    fun grunnlagsbehov(): List<String>
    fun beregn(opplysninger: List<Opplysning<out Any>>): Beregning
}

class Flow<A, B, C>(private val a: ProcessSteg<A, B>, private val b: ProcessSteg<B, C>) : ProcessSteg<A, C> {
    override fun invoke(input: A): C {
        return b(a(input))
    }
}

infix fun <A, B, C> ProcessSteg<A, B>.så(other: ProcessSteg<B, C>): ProcessSteg<A, C> = Flow(this, other)

class VedtaksProsess(
    vilkårsbrøvingService: VilkårsbrøvingService,
    grunnlagService: GrunnlagService,
    beregningService: BeregningService
) : ProcessSteg<StartetBehandling, Vedtak> {
    private val innhentGrunnlag = InnhentGrunnlag(vilkårsbrøvingService, beregningService, grunnlagService)
    private val vilkårsPrøv = VilkårsPrøv(vilkårsbrøvingService)
    private val beregn = Beregn(beregningService)
    private val fattVedtak = FattVedtak()


    private val vedtakflow = innhentGrunnlag så vilkårsPrøv så beregn så fattVedtak

    override operator fun invoke(behandling: StartetBehandling): Vedtak {
        return vedtakflow(behandling)
    }
}

interface ProcessSteg<A, B> {
    operator fun invoke(input: A): B
}

class InnhentGrunnlag(
    private val vilkårsbrøvingService: VilkårsbrøvingService,
    private val beregningService: BeregningService,
    private val grunnlagService: GrunnlagService
) : ProcessSteg<StartetBehandling, BehandlingMedInnhentetGrunnlag> {
    override fun invoke(input: StartetBehandling): BehandlingMedInnhentetGrunnlag {
        return input.let { it + (vilkårsbrøvingService.grunnlagsbehov() + beregningService.grunnlagsbehov()).distinct() }
            .let { it + grunnlagService.innhentGrunnlag(it.prev.fnr, it.grunnlagsBehov).also { grunnlag-> require(grunnlag.map { it.opplysningType }.containsAll(it.grunnlagsBehov) )} }
    }
}

class VilkårsPrøv(private val service: VilkårsbrøvingService) :
    ProcessSteg<BehandlingMedInnhentetGrunnlag, VilkårsprøvdBehandling> {
    override fun invoke(input: BehandlingMedInnhentetGrunnlag): VilkårsprøvdBehandling {
        return input + service.vilkårsprøv(input.grunnlag)
    }
}

class Beregn(private val beregningService: BeregningService) : ProcessSteg<VilkårsprøvdBehandling, BeregnetBehandling> {
    override fun invoke(input: VilkårsprøvdBehandling): BeregnetBehandling {
        return input + beregningService.beregn(input.prev.grunnlag + input.vilkårsprøving)
    }
}

class FattVedtak : ProcessSteg<BeregnetBehandling, Vedtak> {
    override fun invoke(input: BeregnetBehandling): Vedtak {
        return Vedtak(input.prev.prev.grunnlag, input.prev.vilkårsprøving, input.beregning)
    }
}

fun startBehandling(fnr: String): StartetBehandling {
    return StartetBehandling(fnr)
}

class StartetBehandling(val fnr: String) {
    operator fun plus(grunnlagsBehov: List<String>) = BehandlingMedAvklartGrunnlagsbehov(this, grunnlagsBehov)
}

class BehandlingMedAvklartGrunnlagsbehov(val prev: StartetBehandling, val grunnlagsBehov: List<String>) {
    operator fun plus(grunnlag: List<Opplysning<out Any>>) = BehandlingMedInnhentetGrunnlag(this, grunnlag)
}

class BehandlingMedInnhentetGrunnlag(
    val prev: BehandlingMedAvklartGrunnlagsbehov,
    val grunnlag: List<Opplysning<out Any>>
) {
    operator fun plus(vilkårsprøving: Vilkårsprøving) = VilkårsprøvdBehandling(this, vilkårsprøving)
}

class VilkårsprøvdBehandling(val prev: BehandlingMedInnhentetGrunnlag, val vilkårsprøving: Vilkårsprøving) {
    operator fun plus(beregning: Beregning) = BeregnetBehandling(this, beregning)
}

class BeregnetBehandling(val prev: VilkårsprøvdBehandling, val beregning: Beregning)
class BehandlingMedVedtak(val vedtak: Vedtak)

class Vedtak(val grunnlag: List<Opplysning<out Any>>, val vilkårsprøving: Vilkårsprøving, val beregning: Beregning) {
    fun opplysningerSomMåAttesteres():List<String>{
        return vilkårsprøving.opplysningerSomMåAttesteres() + beregning.opplysningerSomMåAttesteres()
    }
    override fun toString(): String {
        return """
                Resultat:$vilkårsprøving
                Beregning: $beregning
                """.trimIndent()
    }
}

open class Opplysning<T>(
    val id: UUID,
    val kilde: Kilde,
    val opplysningType: String,
    val gjelder: String?,
    val opplysning: T,
    val attestering: Kilde? = null
) {
    override fun toString(): String {
        return "Opplysning om $opplysningType: oppgitt av $kilde til å være: $opplysning"
    }

    open fun opplysningerSomMåAttesteres():List<String>{
        return if(kilde is Saksbehandler && attestering == null) listOf("!" + opplysningType) else emptyList()
    }
}

open class Kilde
class Saksbehandler(val ident: String) : Kilde(){
    override fun toString(): String {
        return "saksbehandler $ident"
    }
}
class Privatperson(val fnr: String, val mottatDato: Instant) : Kilde()
class Register(val navn: String, val tidspunktForInnhenting: Instant, val registersReferanse: String?) : Kilde() {
    override fun toString(): String {
        return navn
    }
}

class BeregningsRegel(val navn: String, val ts: Instant, val versjon: String) : Kilde(){
    override fun toString(): String {
        return "beregningsregel  $navn"
    }
}

class VurdertVilkår(
    basertPa: List<Opplysning<out Any>>,
    val vilkår: Vilkår,
    id: UUID,
    kilde: Kilde,
    opplysningType: String,
    gjelder: String?,
    opplysning: VilkårUtfall
) : AvledetVerdi<VilkårUtfall>(basertPa, id, kilde, opplysningType, gjelder, opplysning) {
    override fun toString(): String {
        return "$vilkår $opplysning fordi $basertPa"
    }
}

class Vilkårsprøving(
    basertPa: List<VurdertVilkår>,
    id: UUID,
    kilde: Kilde,
    opplysningType: String,
    gjelder: String?,
    opplysning: VilkårsprøvingResultat
) : AvledetVerdi<VilkårsprøvingResultat>(basertPa, id, kilde, opplysningType, gjelder, opplysning) {
    override fun toString(): String {
        return "$opplysning, fordi $basertPa}"
    }
}

class Beregning(
    basertPa: List<Opplysning<out Any>>,
    id: UUID,
    kilde: Kilde,
    opplysningType: String,
    gjelder: String?,
    opplysning: Int
) : AvledetVerdi<Int>(basertPa, id, kilde, opplysningType, gjelder, opplysning) {
    override fun toString(): String {
        return "$opplysningType beregnet til $opplysning fordi $basertPa"
    }
}

open class AvledetVerdi<T>(
    val basertPa: List<Opplysning<out Any>>,
    id: UUID,
    kilde: Kilde,
    opplysningType: String,
    gjelder: String?,
    opplysning: T
) : Opplysning<T>(id, kilde, opplysningType, gjelder, opplysning) {
    override fun toString(): String {
        return "$opplysning, fastsatt av $kilde fordi $basertPa"
    }

    override fun opplysningerSomMåAttesteres():List<String>{
        if (attestering != null) return emptyList()
        if (kilde is Saksbehandler) return basertPa.map { it.opplysningerSomMåAttesteres() }.flatten() + listOf("!" + this.opplysningType)
        return basertPa.map { it.opplysningerSomMåAttesteres() }.flatten().let {
            if(it.isEmpty()) it else it + listOf(this.opplysningType)
        }
    }
}

enum class VilkårUtfall {
    OPPFYLLT, IKKE_OPPFYLLT
}

enum class VilkårsprøvingResultat {
    INNVILGET, AVSLÅTT
}

data class Vilkår(val navn: String)