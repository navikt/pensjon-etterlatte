package vl

import vl.prosess.AvledetVerdi
import vl.prosess.Beregning
import vl.prosess.BeregningService
import vl.prosess.BeregningsRegel
import vl.prosess.GrunnlagService
import vl.prosess.Opplysning
import vl.prosess.Register
import vl.prosess.Saksbehandler
import vl.prosess.Vilkår
import vl.prosess.VilkårUtfall
import vl.prosess.VilkårsbrøvingService
import vl.prosess.Vilkårsprøving
import vl.prosess.VilkårsprøvingResultat
import vl.prosess.VurdertVilkår
import java.time.Instant
import java.util.*
import javax.swing.JOptionPane

enum class Opplysningtype{
    grunnbeløp,
    trygdetid,
    trygdetidsgrunnlag
}

object Grunnlagsmotor: GrunnlagService{
    override fun innhentGrunnlag(fnr: String, grunnlagsBehov: List<String>):List<Opplysning<out Any>> {
        return grunnlagsBehov.map {
            when(it){
                Opplysningtype.grunnbeløp.name -> listOf(Opplysning(UUID.randomUUID(), Register("satstabell", Instant.now(), null), Opplysningtype.grunnbeløp.name, null, 106_399))
                Opplysningtype.trygdetid.name -> Opplysning(UUID.randomUUID(), Register("trygdetidsregisteret", Instant.now(), null), Opplysningtype.trygdetidsgrunnlag.name, fnr, Trygdetidsregister.hentTrygdetidsperioder(fnr)).let { listOf(it, Trygdetidsfastsetter.fastsettTrygdetid(it)) }
                else -> emptyList()
            }
        }.flatten()
    }
}

object Trygdetidsregister{
    val db = mapOf(
        "1" to listOf(2001, 2002),
        "2" to listOf(2001, 2002, 2003),
        "3" to (1958..2020).toList(),
    )
    fun hentTrygdetidsperioder(fnr: String): Trygdetidsgrunnlag {
        return Trygdetidsgrunnlag(db[fnr]?: emptyList())
    }
}

object Trygdetidsfastsetter{
    fun fastsettTrygdetid(grunnlag: Opplysning<Trygdetidsgrunnlag>): AvledetVerdi<Trygdetid> {
        return  if(grunnlag.opplysning.grunnlag.size < 40)
                AvledetVerdi(listOf(grunnlag), UUID.randomUUID(), Saksbehandler("lars erik"), Opplysningtype.trygdetid.name, grunnlag.gjelder!!, Trygdetid(JOptionPane.showInputDialog(grunnlag.toString()).toInt()))
            else
                AvledetVerdi(listOf(grunnlag), UUID.randomUUID(), BeregningsRegel("fastsetttrygdetid:fullopptjening", Instant.now(), "commithash?"), Opplysningtype.trygdetid.name, grunnlag.gjelder!!, Trygdetid(40)
        )
    }
}

object Vilkårsprøver: VilkårsbrøvingService{
    override fun grunnlagsbehov() = listOf(Opplysningtype.trygdetid.name)
    override fun vilkårsprøv(opplysninger: List<Opplysning<out Any>>): Vilkårsprøving{
        val trygdetidsopplysning = opplysninger.find { it.opplysningType == Opplysningtype.trygdetid.name }
        require(trygdetidsopplysning != null)
        require(trygdetidsopplysning.opplysning is Trygdetid)

        val vurderteVilkår = listOf(
            VurdertVilkår(
                listOf(trygdetidsopplysning),
                Vilkår("minst 3 års trygdetid"),
                UUID.randomUUID(),
                BeregningsRegel("minst 3 års trygdetid", Instant.now(), "commithash?"),
                "vilkårsvurdering:minst3årstrygdetid",
                trygdetidsopplysning.gjelder,
                trygdetidsopplysning.opplysning.grunnlag.let { if(it<3) VilkårUtfall.IKKE_OPPFYLLT else VilkårUtfall.OPPFYLLT}
            ))

        return Vilkårsprøving(
            vurderteVilkår,
            UUID.randomUUID(),
            BeregningsRegel("vilkårsprøving:barnepensjon", Instant.now(), "commithash?"),
            "vilkårsprøving:barnepensjon",
            null,
            if(vurderteVilkår.all { it.opplysning == VilkårUtfall.OPPFYLLT })
                VilkårsprøvingResultat.INNVILGET
            else
                VilkårsprøvingResultat.AVSLÅTT)
    }
}

object Blaze: BeregningService{
    override fun grunnlagsbehov() = listOf(Opplysningtype.trygdetid.name, "grunnbeløp")
    override fun beregn(opplysninger: List<Opplysning<out Any>>): Beregning{
        val vilkårsprøving = opplysninger.find{
            it.opplysningType == "vilkårsprøving:barnepensjon"
        }
        require(vilkårsprøving != null)
        require(vilkårsprøving is Vilkårsprøving)
        if(vilkårsprøving.opplysning != VilkårsprøvingResultat.INNVILGET){
            return nullBeregning(vilkårsprøving)
        }


        val trygdetidsopplysning = opplysninger.find { it.opplysningType == Opplysningtype.trygdetid.name }
        require(trygdetidsopplysning != null)
        require(trygdetidsopplysning.opplysning is Trygdetid)

        val G = opplysninger.find { it.opplysningType == "grunnbeløp" }
        require(G != null)
        require(G.opplysning is Int)

        val uavkortetBeregning = beregnSats(G as Opplysning<Int>)
        return avkortMotFullTrygdetid(uavkortetBeregning, trygdetidsopplysning as Opplysning<Trygdetid>)
    }

    private fun nullBeregning(vilkårsprøving: Vilkårsprøving) = Beregning(
        listOf(vilkårsprøving),
        UUID.randomUUID(),
        BeregningsRegel("avslått ytelse gir ingen utbetaling", Instant.now(), "commithash?"),
        "beregning:nullberegning",
        null,
        0
    )

    private fun beregnSats(G: Opplysning<Int>) = Beregning(
        listOf(G),
        UUID.randomUUID(),
        BeregningsRegel("skal utbetale sats", Instant.now(), "commithash?"),
        "beregning:barnepensjonsats",
        null,
        G.opplysning
    )

    private fun avkortMotFullTrygdetid(uavkortet: Beregning, tt: Opplysning<Trygdetid>) = Beregning(
        listOf(uavkortet, tt),
        UUID.randomUUID(),
        BeregningsRegel("utbetaling skal reduseres mot full trydgetidsopptjening", Instant.now(), "commithash?"),
        "beregning:avkortingmottrygdetid",
        null,
        tt.opplysning.grunnlag.let { (uavkortet.opplysning * it / 40)}
    )
}

data class Trygdetidsgrunnlag(val grunnlag: List<Int>){
    override fun toString(): String {
        return "år med trygdetid: ${grunnlag.joinToString(prefix = "[", postfix = "]", limit = 5, truncated = "+ ${grunnlag.size - 5} til") { it.toString() }}"
    }
}

data class Trygdetid(val grunnlag: Int){
    override fun toString(): String {
        return "$grunnlag års trygdetid"
    }
}
