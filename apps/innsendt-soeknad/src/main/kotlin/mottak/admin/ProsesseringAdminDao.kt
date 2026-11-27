package no.nav.etterlatte.mottak.admin

import efterlatte.prosessering.Metadata
import efterlatte.prosessering.Status
import efterlatte.prosessering.Stoppaarsak
import efterlatte.prosessering.Task
import efterlatte.prosessering.TaskLogg
import efterlatte.prosessering.TaskLoggType
import efterlatte.prosessering.TaskStateMachine
import no.nav.etterlatte.libs.utils.database.singleOrNull
import no.nav.etterlatte.libs.utils.database.toList
import java.sql.Connection
import java.sql.ResultSet
import javax.sql.DataSource

/** Feil som skal vises for operatøren som RFC 7807 med [detail]. */
sealed class AdminFeil(
    val status: Int,
    val detail: String,
) : RuntimeException(detail)

class TaskIkkeFunnet(
    id: Long,
) : AdminFeil(404, "Fant ingen task med id $id")

class UgyldigForespoersel(
    detail: String,
) : AdminFeil(400, detail)

class TaskEndretAvAndre(
    id: Long,
    forventet: Long,
    faktisk: Long,
) : AdminFeil(
        409,
        "Task $id er endret av noen andre. Du så versjon $forventet, men den står nå på versjon $faktisk. " +
            "Hent tasken på nytt og prøv igjen.",
    )

class UlovligOvergang(
    id: Long,
    status: Status,
    handling: Handling,
) : AdminFeil(409, "Task $id har status $status og kan ikke ${handling.verb}")

enum class Handling(
    val nyStatus: Status,
    val verb: String,
) {
    REKJOER(Status.KLAR, "rekjøres"),
    AVBRYT(Status.AVBRUTT, "avbrytes"),
}

data class TaskSide(
    val tasks: List<Task>,
    val side: Int,
    val antallPerSide: Int,
    val antallTotalt: Long,
    val antallSider: Int,
    val avkortet: Boolean = false,
)

data class StatusAntall(
    val status: Status,
    val antall: Long,
)

data class TypeAntall(
    val type: String,
    val antall: Long,
)

/**
 * Operatørens lese- og skrivetilgang til appens tasks. Skriv går gjennom bibliotekets statusmaskin
 * med optimistisk versjon, og operatørhendelser lagres i samme transaksjon som statusendringen.
 */
class ProsesseringAdminDao(
    private val dataSource: DataSource,
) {
    fun statusOversikt(): List<StatusAntall> {
        val antall =
            dataSource.connection.use { c ->
                c
                    .prepareStatement("SELECT status, count(*) FROM prosessering_task GROUP BY status")
                    .executeQuery()
                    .toList { getString(1) to getLong(2) }
                    .toMap()
            }
        return Status.entries.map { StatusAntall(it, antall[it.name] ?: 0) }
    }

    fun typer(): List<TypeAntall> =
        dataSource.connection.use { c ->
            c
                .prepareStatement("SELECT type, count(*) FROM prosessering_task GROUP BY type ORDER BY type")
                .executeQuery()
                .toList { TypeAntall(getString(1), getLong(2)) }
        }

    fun liste(
        status: Status?,
        type: String?,
        side: Int,
        antallPerSide: Int,
    ): TaskSide {
        val filter =
            listOfNotNull(status?.let { "status = ?" }, type?.let { "type = ?" })
                .takeIf { it.isNotEmpty() }
                ?.joinToString(" AND ", prefix = " WHERE ")
                .orEmpty()
        val parametre = listOfNotNull(status?.name, type)
        return dataSource.connection.use { c ->
            val totalt =
                c
                    .prepareStatement("SELECT count(*) FROM prosessering_task$filter")
                    .apply { parametre.forEachIndexed { i, p -> setString(i + 1, p) } }
                    .executeQuery()
                    .singleOrNull { getLong(1) } ?: 0
            val tasks =
                c
                    .prepareStatement(
                        "SELECT * FROM prosessering_task$filter ORDER BY sist_endret_tid DESC, id DESC LIMIT ? OFFSET ?",
                    ).apply {
                        parametre.forEachIndexed { i, p -> setString(i + 1, p) }
                        setInt(parametre.size + 1, antallPerSide)
                        setLong(parametre.size + 2, (side - 1).toLong() * antallPerSide)
                    }.executeQuery()
                    .toList { tilTask() }
            TaskSide(
                tasks = tasks,
                side = side,
                antallPerSide = antallPerSide,
                antallTotalt = totalt,
                antallSider = ((totalt + antallPerSide - 1) / antallPerSide).toInt(),
            )
        }
    }

    fun finn(id: Long): Task? = dataSource.connection.use { c -> finn(c, id, forOppdatering = false) }

    fun logg(id: Long): List<TaskLogg> {
        if (finn(id) == null) throw TaskIkkeFunnet(id)
        return dataSource.connection.use { c ->
            c
                .prepareStatement("SELECT * FROM prosessering_task_hendelse WHERE task_id = ? ORDER BY tidspunkt, id")
                .apply { setLong(1, id) }
                .executeQuery()
                .toList { tilTaskLogg() }
        }
    }

    fun utfoer(
        id: Long,
        forventetVersjon: Long,
        handling: Handling,
        endretAv: String,
        node: String,
        avvik: String? = null,
    ): Task =
        iTransaksjon { c ->
            val gjeldende = finn(c, id, forOppdatering = true) ?: throw TaskIkkeFunnet(id)
            if (gjeldende.versjon != forventetVersjon) throw TaskEndretAvAndre(id, forventetVersjon, gjeldende.versjon)
            if (!TaskStateMachine.erLovlig(fra = gjeldende.status, til = handling.nyStatus)) {
                throw UlovligOvergang(id, gjeldende.status, handling)
            }
            val felter =
                when (handling) {
                    Handling.REKJOER -> "status = ?, trigger_tid = now(), plukket_tid = NULL, stoppaarsak = NULL"
                    Handling.AVBRYT -> "status = ?"
                }
            val oppdatert =
                c
                    .prepareStatement(
                        "UPDATE prosessering_task SET $felter, versjon = versjon + 1, sist_endret_tid = now() " +
                            "WHERE id = ? AND versjon = ? RETURNING *",
                    ).apply {
                        setString(1, handling.nyStatus.name)
                        setLong(2, id)
                        setLong(3, forventetVersjon)
                    }.executeQuery()
                    .singleOrNull { tilTask() } ?: throw TaskEndretAvAndre(id, forventetVersjon, -1)
            leggTilHendelse(
                c,
                id,
                TaskLoggType.STATUS_ENDRET,
                "${gjeldende.status} -> ${handling.nyStatus} (operatør)",
                endretAv,
                node,
            )
            avvik?.let { leggTilHendelse(c, id, TaskLoggType.AVVIK, it, endretAv, node) }
            oppdatert
        }

    fun kommentar(
        id: Long,
        melding: String,
        endretAv: String,
        node: String,
    ): TaskLogg =
        iTransaksjon { c ->
            finn(c, id, forOppdatering = false) ?: throw TaskIkkeFunnet(id)
            leggTilHendelse(c, id, TaskLoggType.KOMMENTAR, melding, endretAv, node)
        }

    private fun leggTilHendelse(
        c: Connection,
        taskId: Long,
        type: TaskLoggType,
        melding: String,
        endretAv: String,
        node: String,
    ): TaskLogg =
        c
            .prepareStatement(
                "INSERT INTO prosessering_task_hendelse (task_id, type, melding, endret_av, node) VALUES (?, ?, ?, ?, ?) RETURNING *",
            ).apply {
                setLong(1, taskId)
                setString(2, type.name)
                setString(3, melding)
                setString(4, endretAv)
                setString(5, node)
            }.executeQuery()
            .singleOrNull { tilTaskLogg() }!!

    private fun finn(
        c: Connection,
        id: Long,
        forOppdatering: Boolean,
    ): Task? =
        c
            .prepareStatement(
                "SELECT * FROM prosessering_task WHERE id = ?" + if (forOppdatering) " FOR UPDATE" else "",
            ).apply { setLong(1, id) }
            .executeQuery()
            .singleOrNull { tilTask() }

    private fun <T> iTransaksjon(block: (Connection) -> T): T =
        dataSource.connection.use { c ->
            c.autoCommit = false
            try {
                block(c).also { c.commit() }
            } catch (e: Throwable) {
                c.rollback()
                throw e
            }
        }

    private fun ResultSet.tilTask() =
        Task(
            id = getLong("id"),
            type = getString("type"),
            status = Status.valueOf(getString("status")),
            payload = getString("payload"),
            triggerTid = getTimestamp("trigger_tid").toInstant(),
            opprettetTid = getTimestamp("opprettet_tid").toInstant(),
            plukketTid = getTimestamp("plukket_tid")?.toInstant(),
            antallFeil = getInt("antall_feil"),
            stoppaarsak = getString("stoppaarsak")?.let { Stoppaarsak.valueOf(it) },
            versjon = getLong("versjon"),
            sistEndretTid = getTimestamp("sist_endret_tid").toInstant(),
            sisteFeilmelding = getString("siste_feilmelding"),
            metadata = Metadata.deserialiser(getString("metadata")),
        )

    private fun ResultSet.tilTaskLogg() =
        TaskLogg(
            id = getLong("id"),
            taskId = getLong("task_id"),
            type = TaskLoggType.valueOf(getString("type")),
            melding = getString("melding"),
            endretAv = getString("endret_av"),
            node = getString("node"),
            tidspunkt = getTimestamp("tidspunkt").toInstant(),
        )
}