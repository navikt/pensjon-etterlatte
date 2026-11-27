-- Bare lesetilgang for personlige databasebrukere. Endringer i tasks skal gå gjennom admin-API-et.
grant select on table prosessering_task, prosessering_task_hendelse, soeknad_mottak to cloudsqliamuser;
