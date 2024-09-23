alter table inntektsjustering
    add status TEXT;

update inntektsjustering
set status = 'LAGRET';

alter table inntektsjustering
    alter column status set not null;