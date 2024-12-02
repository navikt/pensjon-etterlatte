alter table inntektsjustering
    add sist_endret timestamp with time zone default timezone('UTC'::text, now()) not null;

update inntektsjustering
set status = 'FERDIGSTILT'
where status = 'PUBLISERT'
