package soeknad

import io.kotest.matchers.collections.shouldContain
import io.kotest.matchers.collections.shouldContainExactly
import io.kotest.matchers.shouldBe
import no.nav.etterlatte.DataSourceBuilder
import no.nav.etterlatte.libs.common.innsendtsoeknad.common.SoeknadType
import org.junit.jupiter.api.AfterAll
import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertNotEquals
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
    private val kildeBarnepensjon = "barnepensjon-ui"
    private val kildeGjenlevende = "gjenlevendepensjon-ui"


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

        val soeknad = UlagretSoeknad(fnr, json, kildeBarnepensjon)

        val lagretKladd = db.lagreKladd(soeknad)

        val funnetKladd = db.finnKladd(fnr, kildeBarnepensjon)!!

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

        val soeknad = UlagretSoeknad(fnr, json, kildeBarnepensjon, type)

        val lagretKladd = db.lagreKladd(soeknad)
        assertNotNull(lagretKladd)

        val funnetKladd = db.finnKladd(fnr, kildeBarnepensjon)!!
        assertNotNull(funnetKladd)

        val soeknadUnderArbeid = finnSoeknad(funnetKladd.id)
        assertNull(soeknadUnderArbeid?.type, "Søknad skal ikke ha type før den er ferdigstilt")

        val id = db.ferdigstillSoeknad(soeknad)

        val ferdigstiltSoeknad = finnSoeknad(id)
        assertEquals(type, ferdigstiltSoeknad!!.type)

        assertEquals(lagretKladd, funnetKladd)
    }

    @Test
    fun `Lagring av søknad med kilde fungerer`() {
        val fnr = randomFakeFnr()
        val json = """{"harSamtykket":true}"""

        val soeknadBarnepensjon = UlagretSoeknad(fnr, json, kildeBarnepensjon)
        val soeknadGjenlevende = UlagretSoeknad(fnr, json, kildeGjenlevende)

        val lagretKladdBP = db.lagreKladd(soeknadBarnepensjon)
        val lagretKladdGP = db.lagreKladd(soeknadGjenlevende)
        assertNotEquals(lagretKladdBP, lagretKladdGP)

        val funnetKladdBP = db.finnKladd(fnr, kildeBarnepensjon)!!
        val funnetKladdGP = db.finnKladd(fnr, kildeGjenlevende)!!
        assertNotEquals(funnetKladdBP, funnetKladdGP)

        val soeknadUnderArbeidBP = finnSoeknad(funnetKladdBP.id)
        assertEquals(kildeBarnepensjon, soeknadUnderArbeidBP?.kilde)

        val id = db.ferdigstillSoeknad(soeknadBarnepensjon)
        assertEquals(Status.FERDIGSTILT, db.finnKladd(fnr, kildeBarnepensjon)!!.status)
        assertEquals(Status.LAGRETKLADD, db.finnKladd(fnr, kildeGjenlevende)!!.status)

        val ferdigstiltSoeknad = finnSoeknad(id)
        assertEquals(kildeBarnepensjon, ferdigstiltSoeknad!!.kilde)
    }

    @Test
    fun `Hente ut kladd basert på kilde`() {
        val fnr = randomFakeFnr()
        val jsonBP = """{"harSamtykket":true}"""
        val jsonGP = """{"harSamtykket":false}"""

        val soeknadBP = UlagretSoeknad(fnr, jsonBP, kildeBarnepensjon)
        val soeknadGP = UlagretSoeknad(fnr, jsonGP, kildeGjenlevende)

        assertNotNull(db.lagreKladd(soeknadBP), "Kladd for barnepensjon skal være lagret")
        assertNotNull(db.lagreKladd(soeknadGP), "Kladd for gjenlevende skal være lagret")

        val funnetKladdBP = db.finnKladd(fnr, kildeBarnepensjon)!!
        assertEquals(jsonBP, funnetKladdBP.payload)
        assertEquals(fnr, funnetKladdBP.fnr)


        val funnetKladdGP = db.finnKladd(fnr, kildeGjenlevende)!!
        assertEquals(jsonGP, funnetKladdGP.payload)
        assertEquals(fnr, funnetKladdGP.fnr)

        assertNotEquals(funnetKladdBP, funnetKladdGP)
    }

    @Test
    fun `Hent kladd som ikke finnes`() {
        val kladd = db.finnKladd("finnes ikke", kildeBarnepensjon)

        assertNull(kladd)
    }

    @Test
    fun `Lagre ferdig søknad hvor kladd IKKE finnes`() {
        val fnr = randomFakeFnr()
        val json = """{"harSamtykket":true}"""

        assertNull(db.finnKladd(fnr, kildeBarnepensjon))

        val lagretSoeknad = db.lagreKladd(UlagretSoeknad(fnr, json, kildeBarnepensjon))

        assertEquals(json, lagretSoeknad.payload)
    }

    @Test
    fun `Lagre ny søknad returnerer korrekt ID`() {
        val payload = """{"harSamtykket":true}"""

        (1..5).forEach {
            val fnr = randomFakeFnr()

            assertNull(db.finnKladd(fnr, kildeBarnepensjon))

            val soeknad = UlagretSoeknad(fnr, payload, kildeBarnepensjon)
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
        val soeknad = UlagretSoeknad(fnr, json, kildeBarnepensjon)

        assertNull(db.finnKladd(fnr, kildeBarnepensjon))

        val lagretKladd = db.lagreKladd(soeknad)
        assertNotNull(lagretKladd)
        assertEquals(1, lagretKladd.id)
        assertEquals(fnr, lagretKladd.fnr)
        assertEquals(json, lagretKladd.payload)

        val funnetKladd = db.finnKladd(fnr, kildeBarnepensjon)!!
        assertEquals(lagretKladd.id, funnetKladd.id)
        assertEquals(lagretKladd.fnr, funnetKladd.fnr)
        assertEquals(lagretKladd.payload, funnetKladd.payload)

        val nyJson = """{"harSamtykket":true,"omDeg":{"bostedsadresseBekreftet":"Ja"}}"""
        val endretSoeknad = UlagretSoeknad(fnr, nyJson, kildeBarnepensjon)

        val lagretSoeknad = db.lagreKladd(endretSoeknad)
        assertEquals(lagretKladd.id, lagretSoeknad.id)
        assertEquals(lagretKladd.fnr, lagretSoeknad.fnr)
        assertEquals(endretSoeknad.payload, lagretSoeknad.payload)
    }

    @Test
    fun `Kladd skal kunne slettes`() {
        val json = """{"harSamtykket":true}"""

        val s1 = UlagretSoeknad(randomFakeFnr(), json, kildeBarnepensjon)
        val s2 = UlagretSoeknad(randomFakeFnr(), json, kildeBarnepensjon)
        val s3 = UlagretSoeknad(randomFakeFnr(), json, kildeBarnepensjon)

        assertNull(db.finnKladd(s1.fnr, kildeBarnepensjon))
        assertNull(db.finnKladd(s2.fnr, kildeBarnepensjon))
        assertNull(db.finnKladd(s3.fnr, kildeBarnepensjon))

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

        assertEquals(lagretKladd1.id, db.slettKladd(s1.fnr, kildeBarnepensjon))
        assertEquals(lagretKladd2.id, db.slettKladd(s2.fnr, kildeBarnepensjon))
        assertEquals(lagretKladd3.id, db.slettKladd(s3.fnr, kildeBarnepensjon))

        assertNull(db.finnKladd(s1.fnr, kildeBarnepensjon))
        assertNull(db.finnKladd(s2.fnr, kildeBarnepensjon))
        assertNull(db.finnKladd(s3.fnr, kildeBarnepensjon))
    }



    @Test
    fun `Kladd slettes og markeres som konvertert`() {
        val json = """{"harSamtykket":true}"""

        val ulagretBarnep = UlagretSoeknad(randomFakeFnr(), json, kildeBarnepensjon)
        val ulagretGjenlevendep = UlagretSoeknad(randomFakeFnr(), json, kildeGjenlevende)

        assertNull(db.finnKladd(ulagretBarnep.fnr, kildeBarnepensjon))
        assertNull(db.finnKladd(ulagretGjenlevendep.fnr, kildeGjenlevende))

        val lagretKladd1 = db.lagreKladd(ulagretBarnep)
        val lagretKladd2 = db.lagreKladd(ulagretGjenlevendep)

        assertNotNull(lagretKladd1)
        assertNotNull(lagretKladd2)

        assertEquals(ulagretBarnep.fnr, lagretKladd1.fnr)
        assertEquals(ulagretGjenlevendep.fnr, lagretKladd2.fnr)

        assertEquals(json, lagretKladd1.payload)
        assertEquals(json, lagretKladd2.payload)

        assertEquals(lagretKladd1.id, db.slettOgKonverterKladd(ulagretBarnep.fnr, kildeBarnepensjon))
        assertEquals(lagretKladd2.id, db.slettKladd(ulagretGjenlevendep.fnr, kildeGjenlevende))

        assertNull(db.finnKladd(ulagretBarnep.fnr, kildeBarnepensjon))
        assertNull(db.finnKladd(ulagretGjenlevendep.fnr, kildeGjenlevende))

        assertEquals(Status.KONVERTERT, finnSisteStatus(lagretKladd1.id))
        assertEquals(Status.SLETTET, finnSisteStatus(lagretKladd2.id))
    }

    @Test
    fun `Skal kun slette kladd med riktig kilde`() {
        val json = """{"harSamtykket":true}"""
        val fnr = randomFakeFnr()

        val soeknadBarnepensjon = UlagretSoeknad(fnr, json, kildeBarnepensjon)
        val soeknadGjenlevende = UlagretSoeknad(fnr, json, kildeGjenlevende)

        assertNull(db.finnKladd(soeknadBarnepensjon.fnr, kildeBarnepensjon))
        assertNull(db.finnKladd(soeknadGjenlevende.fnr, kildeGjenlevende))

        val lagretKladd1 = db.lagreKladd(soeknadBarnepensjon)
        val lagretKladd2 = db.lagreKladd(soeknadGjenlevende)

        assertNotNull(lagretKladd1)
        assertNotNull(lagretKladd2)

        assertEquals(fnr, lagretKladd1.fnr)
        assertEquals(fnr, lagretKladd2.fnr)

        assertEquals(json, lagretKladd1.payload)
        assertEquals(json, lagretKladd2.payload)

        assertEquals(lagretKladd1.id, db.slettKladd(fnr, kildeBarnepensjon))

        assertNull(db.finnKladd(fnr, kildeBarnepensjon), "Kilde barnepensjon skal være slettet")
        assertNotNull(db.finnKladd(fnr, kildeGjenlevende), "Kilde gjenlevende skal ikke være slettet")

        assertEquals(lagretKladd2.id, db.slettKladd(fnr, kildeGjenlevende))
        assertNull(db.finnKladd(fnr, kildeGjenlevende))
    }

    @Test
    fun `Ferdigstilte søknader skal ikke slettes som kladd`() {
        val fnr = randomFakeFnr()
        val json = """{"harSamtykket":true}"""

        val soeknad = UlagretSoeknad(fnr, json, kildeBarnepensjon)

        assertNull(db.finnKladd(fnr, kildeBarnepensjon))

        val lagretKladd = db.lagreKladd(soeknad)
        assertNotNull(lagretKladd)

        val id = db.ferdigstillSoeknad(soeknad)

        val ferdigstiltSoeknad = finnSoeknad(id)
        assertNull(ferdigstiltSoeknad!!.type) // SoeknadType skal være NULL hvis ikke satt

        assertNull(db.slettKladd(fnr, kildeBarnepensjon))
    }

    @Test
    fun `Nettopp sendt søknad og forsøker å lage ny kladd`() {
        val fnr = randomFakeFnr()
        val nySoeknad = UlagretSoeknad(fnr, "{}", kildeBarnepensjon)

        assertNull(db.finnKladd(fnr, kildeBarnepensjon))

        val soeknad = db.lagreKladd(nySoeknad)

        assertEquals(soeknad.id, db.finnKladd(fnr, kildeBarnepensjon)!!.id)

        db.ferdigstillSoeknad(nySoeknad)

        val ferdigstilSoeknad = db.finnKladd(fnr, kildeBarnepensjon)!!

        assertEquals(Status.FERDIGSTILT, ferdigstilSoeknad.status)

        assertThrows<Exception> {
            db.lagreKladd(UlagretSoeknad(fnr, "{}", kildeBarnepensjon))
        }

        assertThrows<Exception> {
            db.ferdigstillSoeknad(UlagretSoeknad(fnr, "{}", kildeBarnepensjon))
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
            SoeknadTest(1000, fnr1, """{}""", nowUTC.minusDays(5), kildeBarnepensjon),
            SoeknadTest(1111, fnr2, """{}""", nowUTC.minusHours(72), kildeBarnepensjon),
            SoeknadTest(2222, fnr3, """{}""", nowUTC.minusHours(71).plusMinutes(59), kildeBarnepensjon),
            SoeknadTest(3333, fnr4, """{}""", nowUTC, kildeBarnepensjon),
        )
        lagreSoeknaderMedOpprettetTidspunkt(soeknader, true)

        assertEquals(listOf(SlettetSoeknad(1000, fnr1), SlettetSoeknad(1111, fnr2)), db.slettUtgaatteKladder())

        assertNull(db.finnKladd(fnr1, kildeBarnepensjon))
        assertNull(db.finnKladd(fnr2, kildeBarnepensjon))
        assertNotNull(db.finnKladd(fnr3, kildeBarnepensjon))
        assertNotNull(db.finnKladd(fnr4, kildeBarnepensjon))
    }

    @Test
    fun `Kladder skal kun slettes hvis alle kladdhendelsene er over 72 timer`() {
        val soeknadID = 3003L
        val fnr = randomFakeFnr()
        val now = ZonedDateTime.now()
        val utgaattSoeknad = SoeknadTest(soeknadID, fnr, """{}""", now.minusDays(5), kildeBarnepensjon)
        lagreSoeknaderMedOpprettetTidspunkt(listOf(utgaattSoeknad), true)
        nyKladdHendelse(utgaattSoeknad.copy(opprettet = now.minusHours(12)), utgaattSoeknad.id + 1)

        assertEquals(emptyList<SlettetSoeknad>(), db.slettUtgaatteKladder())
        assertNotNull(db.finnKladd(fnr, kildeBarnepensjon))

        // Hendelser tilknyttet slettet søknad skal ikke slettes.
        assertEquals(2, finnHendelser(soeknadID).size)
    }

    @Test
    fun `Kun kladder skal slettes etter 72 timer`() {
        val utgaatt = ZonedDateTime.now(ZoneOffset.UTC).minusDays(4)
        val fnr = randomFakeFnr()
        val soeknad = SoeknadTest(1001, fnr, """{}""", utgaatt, kildeBarnepensjon)
        lagreSoeknaderMedOpprettetTidspunkt(listOf(soeknad))
        assertNotNull(db.finnKladd(soeknad.fnr, kildeBarnepensjon))

        // Skal ikke slette ukategoriserte søknader
        assertEquals(emptyList<SlettetSoeknad>(), db.slettUtgaatteKladder())

        // Skal ikke slette soeknader med hendelse "arkivert"
        db.soeknadArkivert(soeknad.id)
        assertEquals(0, db.slettUtgaatteKladder())

        // Skal ikke slette soeknader med hendelse "arkiveringsfeil"
        slettHendelserForSoeknad(soeknad.id)
        db.soeknadFeiletArkivering(soeknad.id, """{}""")
        assertEquals(0, db.slettUtgaatteKladder())

        // Skal ikke slette soeknader med hendelse "ferdigstillt"
        slettHendelserForSoeknad(soeknad.id)
        db.ferdigstillSoeknad(UlagretSoeknad(soeknad.fnr, soeknad.data, kildeBarnepensjon))
        assertEquals(0, db.slettUtgaatteKladder())

        // Skal ikke slette soeknader med hendelse "sendt"
        slettHendelserForSoeknad(soeknad.id)
        db.soeknadSendt(soeknad.id)
        assertEquals(0, db.slettUtgaatteKladder())
    }

    @Test
    fun `Skal kun lagre en kladd per kilde`() {
        val fnr = randomFakeFnr()
        val json = """{"harSamtykket":true}"""

        val soeknad = UlagretSoeknad(fnr, json, kildeBarnepensjon)

        db.lagreKladd(soeknad)
        db.lagreKladd(soeknad)

        val alleKladder = finnAlleSoeknader(fnr)!!

        assertEquals(1, alleKladder.size)
    }

    @Test
    fun `Usendte søknader skal plukkes opp`() {
        val soeknad1 = LagretSoeknad(2001, "Usendt-1", "{}")
        val soeknad2 = LagretSoeknad(2002, "Usendt-2", "{}")
        val soeknad3 = LagretSoeknad(2003, "Usendt-3", "{}")

        lagreSoeknaderMedOpprettetTidspunkt(
            listOf(
                SoeknadTest(
                    soeknad1.id,
                    soeknad1.fnr,
                    soeknad1.payload,
                    ZonedDateTime.now().minusHours(6),
                    kildeBarnepensjon
                ),
                SoeknadTest(soeknad2.id, soeknad2.fnr, soeknad2.payload, ZonedDateTime.now(), kildeBarnepensjon),
                SoeknadTest(
                    soeknad3.id,
                    soeknad3.fnr,
                    soeknad3.payload,
                    ZonedDateTime.now().minusHours(12),
                    kildeBarnepensjon
                )
            )
        )
        db.ferdigstillSoeknad(UlagretSoeknad(soeknad1.fnr, soeknad1.payload, kildeBarnepensjon))
        db.ferdigstillSoeknad(UlagretSoeknad(soeknad2.fnr, soeknad2.payload, kildeBarnepensjon))
        db.ferdigstillSoeknad(UlagretSoeknad(soeknad3.fnr, soeknad3.payload, kildeBarnepensjon))

        db.usendteSoeknader() shouldContainExactly listOf(soeknad1, soeknad3)
    }

    @Test
    fun `Ukategoriserte søknader skal plukkes opp`() {
        val soeknad = LagretSoeknad(2004, "Ukategorisert", "{}")
        lagreSoeknaderMedOpprettetTidspunkt(
            listOf(SoeknadTest(soeknad.id, soeknad.fnr, soeknad.payload, ZonedDateTime.now(), kildeBarnepensjon))
        )

        db.ukategorisert() shouldContain soeknad.id
    }

    @Test
    fun `Alle hendelser skal lagres i hendelsestabellen`() {
        val kilde = "barnepensjon-ui"
        val soeknad = UlagretSoeknad("AlleHendelser", """{"harSamtykket":"true"}""", kilde)

        db.lagreKladd(soeknad)
        val lagretSoeknadID = db.lagreKladd(soeknad).id
        db.ferdigstillSoeknad(soeknad)
        db.soeknadSendt(lagretSoeknadID)
        db.soeknadFeiletArkivering(lagretSoeknadID, """{"error":"test"}""")
        db.soeknadArkivert(lagretSoeknadID)
        db.soeknadTilDoffenArkivert(lagretSoeknadID)
        db.soeknadHarBehandling(lagretSoeknadID, 1337L, UUID.randomUUID())

        finnHendelser(lagretSoeknadID) shouldContainExactly listOf(
            Status.LAGRETKLADD,
            Status.LAGRETKLADD,
            Status.FERDIGSTILT,
            Status.SENDT,
            Status.ARKIVERT,
            Status.ARKIVERINGSFEIL,
            Status.VENTERBEHANDLING,
            Status.BEHANDLINGLAGRET
        )
    }

    @Test
    fun `Arkiverte søknader skal slettes`() {
        val soeknad = UlagretSoeknad("SlettArkivert", """{"harSamtykket":"true"}""", kildeBarnepensjon)
        val lagretSoeknad = db.lagreKladd(soeknad)
        db.soeknadArkivert(lagretSoeknad.id)

        finnSoeknad(lagretSoeknad.fnr, kildeBarnepensjon) shouldBe lagretSoeknad

        db.slettArkiverteSoeknader()

        finnSoeknad(lagretSoeknad.fnr, kildeBarnepensjon) shouldBe null
    }

    @Test
    fun `Søknader som har behandling i Doffen skal slettes`() {
        val soeknad = UlagretSoeknad("SlettBehandling", """{"harSamtykket":"true"}""", kildeBarnepensjon)
        val lagretSoeknad = db.lagreKladd(soeknad)
        db.soeknadHarBehandling(lagretSoeknad.id, 1337L, UUID.randomUUID())

        finnSoeknad(lagretSoeknad.fnr, kildeBarnepensjon) shouldBe lagretSoeknad

        db.slettArkiverteSoeknader()

        finnSoeknad(lagretSoeknad.fnr, kildeBarnepensjon) shouldBe null
    }

    @Test
    fun `Søknader som skal til Doffen og venter på behandling skal ikke slettes`() {
        val soeknad = UlagretSoeknad("Ikke slett meg", """{"harSamtykket": "true"}""", kildeBarnepensjon)
        val lagretSoeknad = db.lagreKladd(soeknad)
        db.soeknadTilDoffenArkivert(lagretSoeknad.id)

        finnSoeknad(lagretSoeknad.fnr, kildeBarnepensjon) shouldBe lagretSoeknad
        db.slettArkiverteSoeknader()
        finnSoeknad(lagretSoeknad.fnr, kildeBarnepensjon) shouldBe lagretSoeknad
    }


    @Test
    fun `Sjekk innhold i rapport, skal kun være siste status på hver søknad`() {
        // To stk stopper på status KLADD
        db.lagreKladd(UlagretSoeknad(randomFakeFnr(), """{}""", kildeBarnepensjon))
        db.lagreKladd(UlagretSoeknad(randomFakeFnr(), """{}""", kildeBarnepensjon))
        db.lagreKladd(UlagretSoeknad(randomFakeFnr(), """{}""", kildeGjenlevende))

        // Stopp på status "FERDIGSTILT"
        val ferdigstilt = UlagretSoeknad(randomFakeFnr(), """{}""", kildeBarnepensjon)
        db.lagreKladd(ferdigstilt)
        db.ferdigstillSoeknad(ferdigstilt)

        // Stopp på status "SENDT"
        val sendt = UlagretSoeknad(randomFakeFnr(), """{}""", kildeBarnepensjon)
        db.lagreKladd(sendt)
        val sendtId = db.ferdigstillSoeknad(sendt)
        db.soeknadSendt(sendtId)

        val sendt2 = UlagretSoeknad(randomFakeFnr(), """{}""", kildeBarnepensjon)
        db.lagreKladd(sendt2)
        val sendt2Id = db.ferdigstillSoeknad(sendt2)
        db.soeknadSendt(sendt2Id)

        // Stopp på status "SENDT"
        val sendt3 = UlagretSoeknad(randomFakeFnr(), """{}""", kildeGjenlevende)
        db.lagreKladd(sendt3)
        val sendt3Id = db.ferdigstillSoeknad(sendt3)
        db.soeknadSendt(sendt3Id)

        // Stopp på status "ARKIVERINGSFEIL"
        val arkiveringsfeil = UlagretSoeknad(randomFakeFnr(), """{}""", kildeBarnepensjon)
        val arkiveringsfeil2 = UlagretSoeknad(randomFakeFnr(), """{}""", kildeGjenlevende)

        // Lagre kladd 3 ganger
        db.lagreKladd(arkiveringsfeil)
        db.lagreKladd(arkiveringsfeil)
        db.lagreKladd(arkiveringsfeil)

        val lagretSoeknadID = db.lagreKladd(arkiveringsfeil).id
        db.ferdigstillSoeknad(arkiveringsfeil)
        db.soeknadSendt(lagretSoeknadID)
        db.soeknadFeiletArkivering(lagretSoeknadID, """{"error":"test"}""")

        db.lagreKladd(arkiveringsfeil2)
        val lagretSoeknad2ID = db.lagreKladd(arkiveringsfeil2).id
        db.ferdigstillSoeknad(arkiveringsfeil2)
        db.soeknadSendt(lagretSoeknad2ID)
        db.soeknadFeiletArkivering(lagretSoeknad2ID, """{"error":"test"}""")

        // Stopp på status "VENTERBEHANDLING"
        val venterBehandling = UlagretSoeknad(randomFakeFnr(), """{}""", kildeBarnepensjon)
        db.lagreKladd(venterBehandling)
        val venterBehandlingId = db.lagreKladd(venterBehandling).id
        db.ferdigstillSoeknad(venterBehandling)
        db.soeknadSendt(venterBehandlingId)
        db.soeknadTilDoffenArkivert(venterBehandlingId)

        val rapport = db.rapport()

        assertEquals(8, rapport.size)

        assertEquals("2", rapport.find { it.status == Status.LAGRETKLADD && it.kilde == kildeBarnepensjon }?.count)
        assertEquals("1", rapport.find { it.status == Status.FERDIGSTILT && it.kilde == kildeBarnepensjon }?.count)
        assertEquals("2", rapport.find { it.status == Status.SENDT && it.kilde == kildeBarnepensjon }?.count)
        assertEquals("1", rapport.find { it.status == Status.ARKIVERINGSFEIL && it.kilde == kildeBarnepensjon }?.count)
        assertEquals("1", rapport.find { it.status == Status.LAGRETKLADD && it.kilde == kildeGjenlevende }?.count)
        assertEquals("1", rapport.find { it.status == Status.SENDT && it.kilde == kildeGjenlevende }?.count)
        assertEquals("1", rapport.find { it.status == Status.ARKIVERINGSFEIL && it.kilde == kildeGjenlevende }?.count)
        assertEquals("1", rapport.find { it.status == Status.VENTERBEHANDLING }?.count)

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

    @Test
    fun `Sjekk antall av hver kilde`() {
        // To stk stopper på status KLADD
        db.lagreKladd(UlagretSoeknad(randomFakeFnr(), """{}""", kildeGjenlevende))
        db.lagreKladd(UlagretSoeknad(randomFakeFnr(), """{}""", kildeBarnepensjon))

        // Stopp på status "FERDIGSTILT"
        val ferdigstilt = UlagretSoeknad(randomFakeFnr(), """{}""", kildeBarnepensjon)
        db.lagreKladd(ferdigstilt)
        db.ferdigstillSoeknad(ferdigstilt)

        // Stopp på status "SENDT"
        val sendt = UlagretSoeknad(randomFakeFnr(), """{}""", kildeBarnepensjon)
        db.lagreKladd(sendt)
        val sendtId = db.ferdigstillSoeknad(sendt)
        db.soeknadSendt(sendtId)

        // Stopp på status "SENDT"
        val sendt2 = UlagretSoeknad(randomFakeFnr(), """{}""", kildeBarnepensjon)
        db.lagreKladd(sendt2)
        val sendt2Id = db.ferdigstillSoeknad(sendt2)
        db.soeknadSendt(sendt2Id)

        // Stopp på status "ARKIVERINGSFEIL"
        val arkiveringsfeil = UlagretSoeknad(randomFakeFnr(), """{}""", kildeBarnepensjon)

        // Lagre kladd 3 ganger
        db.lagreKladd(arkiveringsfeil)
        db.lagreKladd(arkiveringsfeil)
        db.lagreKladd(arkiveringsfeil)

        val lagretSoeknadID = db.lagreKladd(arkiveringsfeil).id
        db.ferdigstillSoeknad(arkiveringsfeil)
        db.soeknadSendt(lagretSoeknadID)
        db.soeknadFeiletArkivering(lagretSoeknadID, """{"error":"test"}""")

        val kilder = db.kilder()

        assertEquals(2, kilder.size)

        assertEquals(5, kilder[kildeBarnepensjon])
        assertEquals(1, kilder[kildeGjenlevende])

    }

    private fun finnSoeknad(id: SoeknadID): FerdigstiltSoeknad? =
        connection.use { conn ->
            val rs = conn.prepareStatement("SELECT id, type, kilde FROM soeknad WHERE id = ?")
                .apply { setLong(1, id) }
                .executeQuery()

            return if (rs.next()) {
                FerdigstiltSoeknad(
                    rs.getLong("id"),
                    rs.getString("type")?.let { SoeknadType.valueOf(it) },
                    rs.getString("kilde")
                )
            } else null
        }

    private fun lagreSoeknaderMedOpprettetTidspunkt(
        soeknader: List<SoeknadTest>,
        opprettKladdHendelse: Boolean = false
    ) {
        soeknader.forEachIndexed { index, soeknad ->
            connection.use {
                it.prepareStatement(
                    """
                    WITH soeknad_id AS (
                        INSERT INTO soeknad(id, opprettet, kilde) VALUES(${soeknad.id}, ?, ?) RETURNING id
                    ) INSERT INTO innhold(soeknad_id, fnr, payload) VALUES(${soeknad.id}, ?, ?) RETURNING soeknad_id
                """.trimIndent()
                )
                    .apply {
                        setTimestamp(1, Timestamp(Date.from(soeknad.opprettet.toInstant()).time))
                        setString(2, soeknad.kilde)
                        setString(3, soeknad.fnr)
                        setString(4, soeknad.data)
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

    private fun finnSoeknad(fnr: String, kilde: String): LagretSoeknad? {
        return connection.use {
            val pstmt = it.prepareStatement(
                """
                SELECT * FROM innhold i 
                INNER JOIN soeknad s on s.id = i.soeknad_id 
                WHERE i.fnr = ? AND s.kilde = ?
            """.trimIndent()
            )
            pstmt.setString(1, fnr)
            pstmt.setString(2, kilde)

            val rs = pstmt.executeQuery()

            if (rs.next()) LagretSoeknad(rs.getLong("soeknad_id"), rs.getString("fnr"), rs.getString("payload"))
            else null
        }
    }

    private fun finnSisteStatus(id: SoeknadID): Status? {
        return connection.use {
            val rs = it.prepareStatement("""
                    SELECT h.status_id FROM hendelse h
                    WHERE h.soeknad_id = ?
                    ORDER BY h.opprettet DESC
                    LIMIT 1;
                """.trimIndent())
                .apply { setLong(1, id) }
                .executeQuery()

            if (rs.next()) rs.getString("status_id")?.let { id -> Status.valueOf(id) }
            else null
        }
    }

    private fun finnAlleSoeknader(fnr: String): List<LagretSoeknad>? {
        return connection.use {
            val pstmt = it.prepareStatement("SELECT * FROM innhold i WHERE i.fnr = ?")
            pstmt.setString(1, fnr)

            val rs = pstmt.executeQuery()

            generateSequence {
                if (rs.next()) LagretSoeknad(rs.getLong("soeknad_id"), rs.getString("fnr"), rs.getString("payload"))
                else null
            }.toList()
        }
    }

    private data class SoeknadTest(
        val id: SoeknadID,
        val fnr: String,
        val data: String,
        val opprettet: ZonedDateTime,
        val kilde: String
    )
}
