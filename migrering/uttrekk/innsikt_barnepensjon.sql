/*
Laget i forbindele med innsiktsarbeid i oppstarten til team etterlatte.
Trekker ut en oversikt over alle løpende barnepensjoner med en del karakteristikker
*/
WITH persongrunnlag as
         (select pg.kravhode_id, pg.person_grunnlag_id, pd.K_GRNL_ROLLE_T, pg.dod_av_yrkesskade
          from PEN.T_PERSON_GRUNNLAG pg
                   inner join PEN.T_PERSON_DET pd on pd.person_grunnlag_id = pg.person_grunnlag_id and pd.bruk='1' and pd.dato_tom is null)
select
    v.sak_id,
    barn.dato_fodsel "barn fodselsdato",
    floor(months_between(current_date, barn.dato_fodsel) /12) "barn alder",
    land.dekode "barn bostedsland",

    case when k.bodd_arb_utl = '1' then 'ja' Else 'nei' end "barn utland",
    case when k.vur_trygdeav = '1' then 'ja' Else 'nei' end "barn trygdeavtale",

    case when k.far_dod_id is not null then 'ja' Else 'nei' end "far dod",
    case when k.ukjent_far = '1' then 'ja' Else 'nei' end "far ukjent",
    case when k.bodd_arb_utl_far = '1' then 'ja' Else 'nei' end "far utland",
    case when k.vur_trygdeav_far = '1' then 'ja' Else 'nei' end "far trygdeavtale",
    case when pgfar.dod_av_yrkesskade = '1' then 'ja' Else 'nei' end "far dod av yrkesskade",


    case when k.mor_dod_id is not null then 'ja' Else 'nei' end "mor dod",
    case when k.ukjent_mor = '1' then 'ja' Else 'nei' end "mor ukjent",
    case when k.bodd_arb_utl_mor = '1' then 'ja' Else 'nei' end "mor utland",
    case when k.vur_trygdeav_mor = '1' then 'ja' Else 'nei' end "mor trygdeavtale",
    case when pgmor.dod_av_yrkesskade = '1' then 'ja' Else 'nei' end "far dod av yrkesskade",

    case when k.ukjent_avdod = '1' then 'ja' Else 'nei' end "ukjent avdod",

    bk.ANT_BARN "ant barn i kull",
    b.brutto,
    b.netto,
    b.tt_anv "anvendt trygdetid i beregning"
from pen.T_vedtak v
         inner join pen.T_beregning b on v.vedtak_id = b.vedtak_id and b.total_vinner = '1'
    and b.dato_virk_fom < current_date
    and (b.dato_virk_tom is null or b.dato_virk_tom > current_date) -- and b.virk_tom is null
         inner join pen.T_kravhode k on k.kravhode_id = v.kravhode_id
         inner join pen.T_person barn on barn.person_id = v.person_id
         inner join persongrunnlag pgbarn on pgbarn.kravhode_id = k.kravhode_id and pgbarn.K_GRNL_ROLLE_T = 'SOKER'
         left join persongrunnlag pgfar on pgfar.kravhode_id = k.kravhode_id and pgfar.K_GRNL_ROLLE_T = 'FAR'
         left join persongrunnlag pgmor on pgmor.kravhode_id = k.kravhode_id and pgfar.K_GRNL_ROLLE_T = 'MOR'
         left join PEN.T_BARNEKULL bk on bk.PERSON_GRUNNLAG_ID = pgbarn.person_grunnlag_id and bk.bruk='1'
         left join PEN.T_K_LAND_3_TEGN land on land.K_LAND_3_TEGN_ID = coalesce(barn.BOSTEDSLAND, 161)
where v.k_sak_t = 'BARNEP'
  and v.dato_lopende_fom is not null and v.dato_lopende_fom < current_date
  and (v.dato_lopende_tom is null or v.dato_lopende_tom > current_date)
--and floor(months_between(current_date, barn.dato_fodsel) /12) > 18
  and 1=1