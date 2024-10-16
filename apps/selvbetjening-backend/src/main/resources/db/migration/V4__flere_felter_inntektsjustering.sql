-- Eget felt for inntekt utland
alter table inntektsjustering
    add inntekt_fra_utland bigint;

update inntektsjustering
set inntekt_fra_utland = 0;

alter table inntektsjustering
    alter column inntekt_fra_utland set not null;

alter table inntektsjustering
    drop column arbeidsinntekt_utland;

alter table inntektsjustering
    drop column naeringsinntekt_utland;


-- Felter for AFP
alter table inntektsjustering
    add afp_inntekt bigint;

update inntektsjustering
set afp_inntekt = 0;

alter table inntektsjustering
    alter column afp_inntekt set not null;

alter table inntektsjustering
    add afp_tjenesteordning text;


-- Valg om tidlig aldersppensjon
alter table inntektsjustering
    add skal_gaa_av_med_alderspensjon text;

update inntektsjustering
set skal_gaa_av_med_alderspensjon = 'NEI';

alter table inntektsjustering
    alter column skal_gaa_av_med_alderspensjon set not null;

alter table inntektsjustering
    add dato_for_aa_gaa_av_med_alderspensjon date;
