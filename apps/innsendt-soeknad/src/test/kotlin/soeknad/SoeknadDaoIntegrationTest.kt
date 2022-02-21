package soeknad

import innsendtsoeknad.common.SoeknadType
import io.kotest.matchers.collections.shouldContain
import io.kotest.matchers.collections.shouldContainExactly
import io.kotest.matchers.shouldBe
import no.nav.etterlatte.DataSourceBuilder
import org.junit.jupiter.api.AfterAll
import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertNotNull
import org.junit.jupiter.api.Assertions.assertNull
import org.junit.jupiter.api.BeforeAll
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.TestInstance
import org.junit.jupiter.api.assertThrows
import org.junit.jupiter.params.ParameterizedTest
import org.junit.jupiter.params.provider.EnumSource
import org.testcontainers.containers.PostgreSQLContainer
import org.testcontainers.junit.jupiter.Container
import java.sql.Timestamp
import java.time.ZoneOffset
import java.time.ZonedDateTime
import java.util.*
import javax.sql.DataSource
import kotlin.random.Random

@TestInstance(TestInstance.Lifecycle.PER_CLASS)
internal class SoeknadDaoIntegrationTest {
    @Container
    private val postgreSQLContainer = PostgreSQLContainer<Nothing>("postgres:12")

    private lateinit var db: PostgresSoeknadRepository
    private lateinit var dataSource: DataSource

    private val connection get() = dataSource.connection

    @BeforeAll
    fun beforeAll() {
        postgreSQLContainer.start()
        postgreSQLContainer.withUrlParam("user", postgreSQLContainer.username)
        postgreSQLContainer.withUrlParam("password", postgreSQLContainer.password)

        val dsb = DataSourceBuilder(mapOf("DB_JDBC_URL" to postgreSQLContainer.jdbcUrl))
        dataSource = dsb.dataSource

        dsb.migrate()
        db = PostgresSoeknadRepository.using(dataSource)
    }

    @AfterAll
    fun afterAll() {
        postgreSQLContainer.stop()
    }

    @AfterEach
    fun resetTablesAfterEachTest() {
        connection.use {
            it.prepareStatement("TRUNCATE soeknad RESTART IDENTITY CASCADE;").execute()
        }
    }

    private fun randomFakeFnr() = Random.nextLong(10000000000, 99999999999).toString()

    @Test
    fun `Lagring og uthenting av kladd fungerer som forventet`() {
        val fnr = randomFakeFnr()
        val json = """{"harSamtykket":true}"""

        val soeknad = UlagretSoeknad(fnr, json)

        val lagretKladd = db.lagreKladd(soeknad)

        val funnetKladd = db.finnKladd(fnr)!!

        assertNotNull(funnetKladd.id)
        assertEquals(fnr, funnetKladd.fnr)
        assertEquals(json, funnetKladd.payload)

        assertEquals(lagretKladd, funnetKladd)
    }

    @ParameterizedTest
    @EnumSource(SoeknadType::class)
    fun `Lagring av søknad med type fungerer`(type: SoeknadType) {
        val fnr = randomFakeFnr()
        val json = """{"harSamtykket":true}"""

        val soeknad = UlagretSoeknad(fnr, json, type)

        val lagretKladd = db.lagreKladd(soeknad)
        assertNotNull(lagretKladd)

        val funnetKladd = db.finnKladd(fnr)!!
        assertNotNull(funnetKladd)

        val soeknadUnderArbeid = finnSoeknad(funnetKladd.id)
        assertNull(soeknadUnderArbeid?.second, "Søknad skal ikke ha type før den er ferdigstilt")

        val id = db.ferdigstillSoeknad(soeknad)

        val ferdigstiltSoeknad = finnSoeknad(id)
        assertEquals(type, ferdigstiltSoeknad!!.second)

        assertEquals(lagretKladd, funnetKladd)
    }

    @Test
    fun `Hent kladd som ikke finnes`() {
        val kladd = db.finnKladd("finnes ikke")

        assertNull(kladd)
    }

    @Test
    fun `Lagre ferdig søknad hvor kladd IKKE finnes`() {
        val fnr = randomFakeFnr()
        val json = """{"harSamtykket":true}"""

        assertNull(db.finnKladd(fnr))

        val lagretSoeknad = db.lagreKladd(UlagretSoeknad(fnr, json))

        assertEquals(json, lagretSoeknad.payload)
    }

    @Test
    fun `Lagre ny søknad returnerer korrekt ID`() {
        val payload = """{"harSamtykket":true}"""

        (1..5).forEach {
            val fnr = randomFakeFnr()

            assertNull(db.finnKladd(fnr))

            val soeknad = UlagretSoeknad(fnr, payload)
            val lagretSoeknad = db.lagreKladd(soeknad)

            assertEquals(payload, lagretSoeknad.payload)
            assertEquals(it.toLong(), lagretSoeknad.id)
            assertEquals(fnr, lagretSoeknad.fnr)

            val oppdatertSoeknad = db.lagreKladd(soeknad)
            assertEquals(payload, oppdatertSoeknad.payload)
            assertEquals(it.toLong(), oppdatertSoeknad.id)
            assertEquals(fnr, oppdatertSoeknad.fnr)
        }
    }

    @Test
    fun `Lagre ferdig søknad hvor kladd finnes`() {
        val fnr = randomFakeFnr()
        val json = """{"harSamtykket":true}"""
        val soeknad = UlagretSoeknad(fnr, json)

        assertNull(db.finnKladd(fnr))

        val lagretKladd = db.lagreKladd(soeknad)
        assertNotNull(lagretKladd)
        assertEquals(1, lagretKladd.id)
        assertEquals(fnr, lagretKladd.fnr)
        assertEquals(json, lagretKladd.payload)

        val funnetKladd = db.finnKladd(fnr)!!
        assertEquals(lagretKladd.id, funnetKladd.id)
        assertEquals(lagretKladd.fnr, funnetKladd.fnr)
        assertEquals(lagretKladd.payload, funnetKladd.payload)

        val nyJson = """{"harSamtykket":true,"omDeg":{"bostedsadresseBekreftet":"Ja"}}"""
        val endretSoeknad = UlagretSoeknad(fnr, nyJson)

        val lagretSoeknad = db.lagreKladd(endretSoeknad)
        assertEquals(lagretKladd.id, lagretSoeknad.id)
        assertEquals(lagretKladd.fnr, lagretSoeknad.fnr)
        assertEquals(endretSoeknad.payload, lagretSoeknad.payload)
    }

    @Test
    fun `Kladd skal kunne slettes`() {
        val json = """{"harSamtykket":true}"""

        val s1 = UlagretSoeknad(randomFakeFnr(), json)
        val s2 = UlagretSoeknad(randomFakeFnr(), json)
        val s3 = UlagretSoeknad(randomFakeFnr(), json)

        assertNull(db.finnKladd(s1.fnr))
        assertNull(db.finnKladd(s2.fnr))
        assertNull(db.finnKladd(s3.fnr))

        val lagretKladd1 = db.lagreKladd(s1)
        val lagretKladd2 = db.lagreKladd(s2)
        val lagretKladd3 = db.lagreKladd(s3)

        assertNotNull(lagretKladd1)
        assertNotNull(lagretKladd2)
        assertNotNull(lagretKladd3)

        assertEquals(s1.fnr, lagretKladd1.fnr)
        assertEquals(s2.fnr, lagretKladd2.fnr)
        assertEquals(s3.fnr, lagretKladd3.fnr)

        assertEquals(json, lagretKladd1.payload)
        assertEquals(json, lagretKladd2.payload)
        assertEquals(json, lagretKladd3.payload)

        assertEquals(lagretKladd1.id, db.slettKladd(s1.fnr))
        assertEquals(lagretKladd2.id, db.slettKladd(s2.fnr))
        assertEquals(lagretKladd3.id, db.slettKladd(s3.fnr))

        assertNull(db.finnKladd(s1.fnr))
        assertNull(db.finnKladd(s2.fnr))
        assertNull(db.finnKladd(s3.fnr))
    }

    @Test
    fun `Ferdigstilte søknader skal ikke slettes som kladd`() {
        val fnr = randomFakeFnr()
        val json = """{"harSamtykket":true}"""
        val soeknad = UlagretSoeknad(fnr, json)

        assertNull(db.finnKladd(fnr))

        val lagretKladd = db.lagreKladd(soeknad)
        assertNotNull(lagretKladd)

        val id = db.ferdigstillSoeknad(soeknad)

        val ferdigstiltSoeknad = finnSoeknad(id)
        assertNull(ferdigstiltSoeknad!!.second) // SoeknadType skal være NULL hvis ikke satt

        assertNull(db.slettKladd(fnr))
    }

    @Test
    fun `Nettopp sendt søknad og forsøker å lage ny kladd`() {
        val fnr = randomFakeFnr()
        val nySoeknad = UlagretSoeknad(fnr, "{}")

        assertNull(db.finnKladd(fnr))

        val soeknad = db.lagreKladd(nySoeknad)

        assertEquals(soeknad.id, db.finnKladd(fnr)!!.id)

        db.ferdigstillSoeknad(nySoeknad)

        val ferdigstilSoeknad = db.finnKladd(fnr)!!

        assertEquals(Status.FERDIGSTILT, ferdigstilSoeknad.status)

        assertThrows<Exception> {
            db.lagreKladd(UlagretSoeknad(fnr, "{}"))
        }

        assertThrows<Exception> {
            db.ferdigstillSoeknad(UlagretSoeknad(fnr, "{}"))
        }
    }

    @Test
    fun `Kladder skal slettes etter 72 timer`() {
        val nowUTC = ZonedDateTime.now(ZoneOffset.UTC)

        val fnr1 = randomFakeFnr()
        val fnr2 = randomFakeFnr()
        val fnr3 = randomFakeFnr()
        val fnr4 = randomFakeFnr()

        val soeknader = listOf(
            SoeknadTest(1000, fnr1, """{}""", nowUTC.minusDays(5)),
            SoeknadTest(1111, fnr2, """{}""", nowUTC.minusHours(72)),
            SoeknadTest(2222, fnr3, """{}""", nowUTC.minusHours(71).plusMinutes(59)),
            SoeknadTest(3333, fnr4, """{}""", nowUTC),
        )
        lagreSoeknaderMedOpprettetTidspunkt(soeknader, true)

        assertEquals(2, db.slettUtgaatteKladder())

        assertNull(db.finnKladd(fnr1))
        assertNull(db.finnKladd(fnr2))
        assertNotNull(db.finnKladd(fnr3))
        assertNotNull(db.finnKladd(fnr4))
    }

    @Test
    fun `Kladder skal kun slettes hvis alle kladdhendelsene er over 72 timer`() {
        val soeknadID = 3003L
        val fnr = randomFakeFnr()
        val now = ZonedDateTime.now()
        val utgaattSoeknad = SoeknadTest(soeknadID, fnr, """{}""", now.minusDays(5))
        lagreSoeknaderMedOpprettetTidspunkt(listOf(utgaattSoeknad), true)
        nyKladdHendelse(utgaattSoeknad.copy(opprettet = now.minusHours(12)), utgaattSoeknad.id + 1)

        assertEquals(0, db.slettUtgaatteKladder())
        assertNotNull(db.finnKladd(fnr))

        // Hendelser tilknyttet slettet søknad skal ikke slettes.
        assertEquals(2, finnHendelser(soeknadID).size)
    }

    @Test
    fun `Kun kladder skal slettes etter 72 timer`() {
        val utgaatt = ZonedDateTime.now(ZoneOffset.UTC).minusDays(4)
        val soeknad = SoeknadTest(1001, randomFakeFnr(), """{}""", utgaatt)
        lagreSoeknaderMedOpprettetTidspunkt(listOf(soeknad))
        assertNotNull(db.finnKladd(soeknad.fnr))

        // Skal ikke slette ukategoriserte søknader
        assertEquals(0, db.slettUtgaatteKladder())

        // Skal ikke slette soeknader med hendelse "arkivert"
        db.soeknadArkivert(soeknad.id)
        assertEquals(0, db.slettUtgaatteKladder())

        // Skal ikke slette soeknader med hendelse "arkiveringsfeil"
        slettHendelserForSoeknad(soeknad.id)
        db.soeknadFeiletArkivering(soeknad.id, """{}""")
        assertEquals(0, db.slettUtgaatteKladder())

        // Skal ikke slette soeknader med hendelse "ferdigstillt"
        slettHendelserForSoeknad(soeknad.id)
        db.ferdigstillSoeknad(UlagretSoeknad(soeknad.fnr, soeknad.data))
        assertEquals(0, db.slettUtgaatteKladder())

        // Skal ikke slette soeknader med hendelse "sendt"
        slettHendelserForSoeknad(soeknad.id)
        db.soeknadSendt(soeknad.id)
        assertEquals(0, db.slettUtgaatteKladder())
    }

    @Test
    fun `Usendte søknader skal plukkes opp`() {
        val soeknad1 = LagretSoeknad(2001, "Usendt-1", "{}")
        val soeknad2 = LagretSoeknad(2002, "Usendt-2", "{}")
        val soeknad3 = LagretSoeknad(2003, "Usendt-3", "{}")
        lagreSoeknaderMedOpprettetTidspunkt(
            listOf(
                SoeknadTest(soeknad1.id, soeknad1.fnr, soeknad1.payload, ZonedDateTime.now().minusHours(6)),
                SoeknadTest(soeknad2.id, soeknad2.fnr, soeknad2.payload, ZonedDateTime.now()),
                SoeknadTest(soeknad3.id, soeknad3.fnr, soeknad3.payload, ZonedDateTime.now().minusHours(12))
            )
        )
        db.ferdigstillSoeknad(UlagretSoeknad(soeknad1.fnr, soeknad1.payload))
        db.ferdigstillSoeknad(UlagretSoeknad(soeknad2.fnr, soeknad2.payload))
        db.ferdigstillSoeknad(UlagretSoeknad(soeknad3.fnr, soeknad3.payload))

        db.usendteSoeknader() shouldContainExactly listOf(soeknad1, soeknad3)
    }

    @Test
    fun `Ukategoriserte søknader skal plukkes opp`() {
        val soeknad = LagretSoeknad(2004, "Ukategorisert", "{}")
        lagreSoeknaderMedOpprettetTidspunkt(
            listOf(SoeknadTest(soeknad.id, soeknad.fnr, soeknad.payload, ZonedDateTime.now()))
        )

        db.ukategorisert() shouldContain soeknad.id
    }

    @Test
    fun `Alle hendelser skal lagres i hendelsestabellen`() {
        val soeknad = UlagretSoeknad("AlleHendelser", """{"harSamtykket":"true"}""")

        db.lagreKladd(soeknad)
        val lagretSoeknadID = db.lagreKladd(soeknad).id
        db.ferdigstillSoeknad(soeknad)
        db.soeknadSendt(lagretSoeknadID)
        db.soeknadFeiletArkivering(lagretSoeknadID, """{"error":"test"}""")
        db.soeknadArkivert(lagretSoeknadID)

        finnHendelser(lagretSoeknadID) shouldContainExactly listOf(
            Status.LAGRETKLADD,
            Status.LAGRETKLADD,
            Status.FERDIGSTILT,
            Status.SENDT,
            Status.ARKIVERT,
            Status.ARKIVERINGSFEIL
        )
    }

    @Test
    fun `Arkiverte søknader skal slettes`() {
        val soeknad = UlagretSoeknad("SlettArkivert", """{"harSamtykket":"true"}""")
        val lagretSoeknad = db.lagreKladd(soeknad)
        db.soeknadArkivert(lagretSoeknad.id)

        finnSoeknad(lagretSoeknad.fnr) shouldBe lagretSoeknad

        db.slettArkiverteSoeknader()

        finnSoeknad(lagretSoeknad.fnr) shouldBe null
    }

    @Test
    fun `Sjekk innhold i rapport, skal kun være siste status på hver søknad`() {
        // To stk stopper på status KLADD
        db.lagreKladd(UlagretSoeknad(randomFakeFnr(), """{}"""))
        db.lagreKladd(UlagretSoeknad(randomFakeFnr(), """{}"""))

        // Stopp på status "FERDIGSTILT"
        val ferdigstilt = UlagretSoeknad(randomFakeFnr(), """{}""")
        db.lagreKladd(ferdigstilt)
        db.ferdigstillSoeknad(ferdigstilt)

        // Stopp på status "SENDT"
        val sendt = UlagretSoeknad(randomFakeFnr(), """{}""")
        db.lagreKladd(sendt)
        val sendtId = db.ferdigstillSoeknad(sendt)
        db.soeknadSendt(sendtId)

        // Stopp på status "SENDT"
        val sendt2 = UlagretSoeknad(randomFakeFnr(), """{}""")
        db.lagreKladd(sendt2)
        val sendt2Id = db.ferdigstillSoeknad(sendt2)
        db.soeknadSendt(sendt2Id)

        // Stopp på status "ARKIVERINGSFEIL"
        val arkiveringsfeil = UlagretSoeknad(randomFakeFnr(), """{}""")

        // Lagre kladd 3 ganger
        db.lagreKladd(arkiveringsfeil)
        db.lagreKladd(arkiveringsfeil)
        db.lagreKladd(arkiveringsfeil)

        val lagretSoeknadID = db.lagreKladd(arkiveringsfeil).id
        db.ferdigstillSoeknad(arkiveringsfeil)
        db.soeknadSendt(lagretSoeknadID)
        db.soeknadFeiletArkivering(lagretSoeknadID, """{"error":"test"}""")

        val rapport = db.rapport()

        assertEquals(4, rapport.size)

        assertEquals(2, rapport[Status.LAGRETKLADD])
        assertEquals(1, rapport[Status.FERDIGSTILT])
        assertEquals(2, rapport[Status.SENDT])
        assertEquals(1, rapport[Status.ARKIVERINGSFEIL])
    }

    @Test
    fun `Sjekk at alle statuser finnes i databasen`() {
        val statusListe: List<Status> = connection.use {
            it.prepareStatement("SELECT id FROM status")
                .executeQuery()
                .let {
                    generateSequence {
                        if (it.next()) Status.valueOf(it.getString(1))
                        else null
                    }.toList()
                }
        }

        assertEquals(Status.values().size, statusListe.size)
    }

    private fun finnSoeknad(id: SoeknadID): Pair<SoeknadID, SoeknadType?>? =
        connection.use {
            val rs = it.prepareStatement("SELECT id, type FROM soeknad WHERE id = ?")
                .apply { setLong(1, id) }
                .executeQuery()

            return if (rs.next()) {
                Pair(
                    rs.getLong("id"),
                    rs.getString("type")?.let { SoeknadType.valueOf(it) }
                )
            } else null
        }

    private fun lagreSoeknaderMedOpprettetTidspunkt(
        soeknader: List<SoeknadTest>,
        opprettKladdHendelse: Boolean = false
    ) {
        soeknader.forEachIndexed { index, soeknad ->
            connection.use {
                it.prepareStatement("""
                    WITH soeknad_id AS (
                        INSERT INTO soeknad(id, opprettet) VALUES(${soeknad.id}, ?) RETURNING id
                    ) INSERT INTO innhold(soeknad_id, fnr, payload) VALUES(${soeknad.id}, ?, ?) RETURNING soeknad_id
                """.trimIndent())
                    .apply {
                        setTimestamp(1, Timestamp(Date.from(soeknad.opprettet.toInstant()).time))
                        setString(2, soeknad.fnr)
                        setString(3, soeknad.data)
                    }
                    .execute()
            }

            if (opprettKladdHendelse) nyKladdHendelse(soeknad, (soeknad.id + index))
        }
    }

    private fun nyKladdHendelse(soeknad: SoeknadTest, hendelseId: Long) {
        connection.use {
            it.prepareStatement("INSERT INTO hendelse(id, soeknad_id, status_id, payload, opprettet) VALUES(?, ?, ?, ?, ?)")
            .apply {
                setLong(1, hendelseId)
                setLong(2, soeknad.id)
                setString(3, Status.LAGRETKLADD.name)
                setString(4, "{}")
                setTimestamp(5, Timestamp(Date.from(soeknad.opprettet.toInstant()).time))
            }
            .execute()
        }
    }

    private fun slettHendelserForSoeknad(soeknadId: Long) {
        connection.use {
            it.prepareStatement("DELETE FROM hendelse WHERE soeknad_id = ?")
                .apply { setLong(1, soeknadId) }
                .execute()
        }
    }

    private fun finnHendelser(soeknadId: Long): List<Status> {
        val sql = """
            SELECT status.id FROM hendelse 
            INNER JOIN status ON hendelse.status_id = status.id
            WHERE soeknad_id = ?
            ORDER BY status.rang
        """.trimIndent()

        return connection.use {
            val rs = it.prepareStatement(sql)
                .apply { setLong(1, soeknadId) }
                .executeQuery()

            generateSequence {
                if (rs.next()) Status.valueOf(rs.getString(1))
                else null
            }.toList()
        }
    }

    private fun finnSoeknad(fnr: String): LagretSoeknad? {
        return connection.use {
            val pstmt = it.prepareStatement("SELECT * FROM innhold WHERE fnr = ?")
            pstmt.setString(1, fnr)

            val rs = pstmt.executeQuery()

            if (rs.next()) LagretSoeknad(rs.getLong("soeknad_id"), rs.getString("fnr"), rs.getString("payload"))
            else null
        }
    }

    private data class SoeknadTest(
        val id: SoeknadID,
        val fnr: String,
        val data: String,
        val opprettet: ZonedDateTime
    )
}
