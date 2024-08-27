alter table inntektsjustering
    add inntektsaar int8;

update inntektsjustering
set inntektsaar = 2025;

alter table inntektsjustering
    alter column inntektsaar set not null;