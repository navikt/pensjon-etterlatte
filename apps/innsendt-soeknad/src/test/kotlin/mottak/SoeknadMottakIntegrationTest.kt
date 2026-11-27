package no.nav.etterlatte.mottak

import com.fasterxml.jackson.annotation.JsonInclude
import com.github.navikt.tbd_libs.rapids_and_rivers.test_support.TestRapid
import efterlatte.prosessering.RetryPolicy
import io.getunleash.UnleashContext
import io.kotest.matchers.collections.shouldContainExactly
import io.kotest.matchers.shouldBe
import io.kotest.matchers.string.shouldContain
import io.kotest.matchers.string.shouldNotContain
import io.ktor.client.HttpClient
import io.ktor.client.engine.mock.MockEngine
import io.ktor.client.engine.mock.MockRequestHandleScope
import io.ktor.client.engine.mock.respond
import io.ktor.client.engine.mock.toByteArray
import io.ktor.client.plugins.contentnegotiation.ContentNegotiation
import io.ktor.client.request.HttpResponseData
import io.ktor.http.HttpHeaders
import io.ktor.http.HttpStatusCode
import io.ktor.http.headersOf
import io.ktor.serialization.jackson3.jackson
import io.mockk.coEvery
import io.mockk.mockk
import kotlinx.coroutines.runBlocking
import no.nav.etterlatte.JournalpostSkrevet
import no.nav.etterlatte.UtkastPubliserer
import no.nav.etterlatte.adressebeskyttelse.AdressebeskyttelseService
import no.nav.etterlatte.funksjonsbrytere.FeatureToggle
import no.nav.etterlatte.funksjonsbrytere.FeatureToggleProperties
import no.nav.etterlatte.funksjonsbrytere.FeatureToggleService
import no.nav.etterlatte.libs.common.innsendtsoeknad.common.InnsendtSoeknad
import no.nav.etterlatte.libs.common.innsendtsoeknad.common.SoeknadRequest
import no.nav.etterlatte.libs.common.innsendtsoeknad.common.SoeknadType
import no.nav.etterlatte.libs.common.person.Foedselsnummer
import no.nav.etterlatte.libs.utils.test.InnsendtSoeknadFixtures
import no.nav.etterlatte.mapper
import no.nav.etterlatte.mottak.steg.MOTTAKSFLYT_NOEKKEL
import no.nav.etterlatte.soeknad.SoeknadService
import opprettInMemoryDatabase
import org.junit.jupiter.api.AfterAll
import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.BeforeAll
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.TestInstance
import org.junit.jupiter.api.assertThrows
import org.testcontainers.containers.PostgreSQLContainer
import org.testcontainers.junit.jupiter.Container
import soeknad.Mottaksflyt
import soeknad.PostgresSoeknadRepository
import soeknad.SoeknadID
import soeknad.Status
import soeknad.UlagretSoeknad
import tools.jackson.databind.JsonNode
import tools.jackson.databind.node.ObjectNode
import java.util.concurrent.CopyOnWriteArrayList
import java.util.concurrent.CountDownLatch
import java.util.concurrent.Executors
import java.util.concurrent.TimeUnit
import java.util.concurrent.atomic.AtomicInteger
import javax.sql.DataSource
import kotlin.time.Duration.Companion.milliseconds

@TestInstance(TestInstance.Lifecycle.PER_CLASS)
internal class SoeknadMottakIntegrationTest {
    @Container
    private val postgreSQLContainer = PostgreSQLContainer<Nothing>("postgres:14")

    private lateinit var dataSource: DataSource
    private lateinit var db: PostgresSoeknadRepository
    private lateinit var mottak: SoeknadMottakKontekst

    private val kilde = "utvidet-omstillingsstoenad-ui"
    private val utvidet = SoeknadType.UTVIDET_OMSTILLINGSSTOENAD
    private val toggle = FakeToggles()
    private val rapid = TestRapid()
    private val mottakDao = SoeknadMottakDao()

    private val kall = CopyOnWriteArrayList<Pair<String, JsonNode?>>()

    @Volatile private var gjennyKontekst: (JsonNode) -> Svar = { Svar(HttpStatusCode.OK, kontekstSvar(ukjent = false)) }

    @Volatile private var gjennyOverlevering: (JsonNode) -> Svar = { Svar(HttpStatusCode.OK, overleveringSvar(it)) }

    @Volatile private var dokarkiv: (JsonNode) -> Svar = { Svar(HttpStatusCode.OK, journalpostSvar("123456789")) }

    private val service
        get() =
            SoeknadService(
                db,
                mockk<UtkastPubliserer>(relaxed = true),
                mockk<AdressebeskyttelseService>().apply { coEvery { hentGradering(any(), any()) } returns emptyMap() },
                mottak.starter,
            )

    @BeforeAll
    fun beforeAll() {
        val (_, dsb) = opprettInMemoryDatabase(postgreSQLContainer)
        dataSource = dsb.dataSource
        db = PostgresSoeknadRepository.using(dataSource)
        mottak = nyttMottak()
    }

    @AfterEach
    fun reset() {
        mottak.prosessering.stopp()
        mottak = nyttMottak()
        dataSource.connection.use {
            it
                .prepareStatement(
                    "TRUNCATE soeknad, prosessering_task, prosessering_task_hendelse RESTART IDENTITY CASCADE",
                ).execute()
        }
        kall.clear()
        rapid.reset()
        toggle.paa = true
        gjennyKontekst = { Svar(HttpStatusCode.OK, kontekstSvar(ukjent = false)) }
        gjennyOverlevering = { Svar(HttpStatusCode.OK, overleveringSvar(it)) }
        dokarkiv = { Svar(HttpStatusCode.OK, journalpostSvar("123456789")) }
    }

    @AfterAll
    fun afterAll() {
        mottak.prosessering.stopp()
        postgreSQLContainer.stop()
    }

    @Test
    fun `ny utvidet OMS-soeknad lagres med prosesseringsflyt, mottaksdata og foerste task i samme transaksjon`() {
        val fnr = lagFnr(1)
        val id = sendInn(fnr)

        db.mottaksflyt(id) shouldBe Mottaksflyt.PROSESSERING
        val task = tasks().single()
        task.type shouldBe MottakTasks.HENT_JOURNALFOERINGSKONTEKST.navn
        task.status shouldBe "KLAR"
        task.payload shouldBe """{"soeknadId":$id}"""
        task.metadata!! shouldContain "UTVIDET_OMSTILLINGSSTOENAD"
        task.metadata shouldNotContain fnr.value
        antall("SELECT count(*) FROM soeknad_mottak WHERE soeknad_id = $id") shouldBe 1
    }

    @Test
    fun `toggle av og andre soeknadstyper gir Kafka-flyt uten task`() {
        toggle.paa = false
        val utvidetId = sendInn(lagFnr(2))
        toggle.paa = true
        val bpId =
            sendInn(
                lagFnr(3),
                InnsendtSoeknadFixtures.barnepensjon(innsenderFnr = lagFnr(3)),
                kilde = "barnepensjon-ui",
            )

        db.mottaksflyt(utvidetId) shouldBe Mottaksflyt.KAFKA
        db.mottaksflyt(bpId) shouldBe Mottaksflyt.KAFKA
        tasks() shouldBe emptyList()
        settOpprettetTilbake(utvidetId)
        settOpprettetTilbake(bpId)
        db.usendteSoeknader().map { it.id }.toSet() shouldBe setOf(utvidetId, bpId)
    }

    @Test
    fun `soeknad ferdigstilt foer mottaksflyt fantes hoerer til Kafka-loepet`() {
        val id = sendInn(lagFnr(16))
        dataSource.connection.use {
            it.prepareStatement("ALTER TABLE soeknad DISABLE TRIGGER soeknad_mottaksflyt_uendret").execute()
            it.prepareStatement("UPDATE soeknad SET mottaksflyt = NULL WHERE id = $id").executeUpdate()
            it.prepareStatement("ALTER TABLE soeknad ENABLE TRIGGER soeknad_mottaksflyt_uendret").execute()
        }
        settOpprettetTilbake(id)

        db.mottaksflyt(id) shouldBe Mottaksflyt.KAFKA
        db.usendteSoeknader().map { it.id } shouldBe listOf(id)
    }

    @Test
    fun `feil etter at foerste task er skrevet ruller tilbake soeknad, kladd, mottak og task`() {
        val fnr = lagFnr(4).value
        val kladd = db.lagreKladd(UlagretSoeknad(fnr, """{"kladd":true}""", kilde))

        assertThrows<IllegalStateException> {
            db.ferdigstillSoeknadForProsessering(UlagretSoeknad(fnr, """{"ny":true}""", kilde, utvidet)) { c, id ->
                mottak.starter.start(c, id, utvidet)
                error("feil etter task")
            }
        }

        val etter = db.finnKladd(fnr, kilde)!!
        etter.id shouldBe kladd.id
        etter.payload shouldBe """{"kladd":true}"""
        etter.status shouldBe Status.LAGRETKLADD
        tasks() shouldBe emptyList()
        antall("SELECT count(*) FROM soeknad_mottak") shouldBe 0
        antall("SELECT count(*) FROM soeknad WHERE mottaksflyt IS NOT NULL") shouldBe 0
    }

    @Test
    fun `samtidig ferdigstilling av samme kladd gir en soeknad og en kjede`() {
        val fnr = lagFnr(5).value
        db.lagreKladd(UlagretSoeknad(fnr, "{}", kilde))
        val start = CountDownLatch(1)
        val ok = AtomicInteger()
        val feil = AtomicInteger()
        val pool = Executors.newFixedThreadPool(4)
        repeat(4) {
            pool.submit {
                start.await()
                runCatching {
                    db.ferdigstillSoeknadForProsessering(UlagretSoeknad(fnr, "{}", kilde, utvidet)) { c, id ->
                        mottak.starter.start(c, id, utvidet)
                    }
                }.onSuccess { ok.incrementAndGet() }.onFailure { feil.incrementAndGet() }
            }
        }
        start.countDown()
        pool.shutdown()
        pool.awaitTermination(30, TimeUnit.SECONDS) shouldBe true

        ok.get() shouldBe 1
        feil.get() shouldBe 3
        tasks().size shouldBe 1
        antall("SELECT count(*) FROM hendelse WHERE status_id = 'FERDIGSTILT'") shouldBe 1
        antall("SELECT count(*) FROM soeknad_mottak") shouldBe 1
    }

    @Test
    fun `lagret mottaksflyt kan ikke endres`() {
        val id = sendInn(lagFnr(6))
        assertThrows<Exception> {
            dataSource.connection.use {
                it.prepareStatement("UPDATE soeknad SET mottaksflyt = 'KAFKA' WHERE id = $id").executeUpdate()
            }
        }
        db.mottaksflyt(id) shouldBe Mottaksflyt.PROSESSERING
    }

    @Test
    fun `hele kjeden journalfoerer, overleverer, publiserer kompatibilitetsevent og arkiverer foerst til slutt`() {
        val fnr = lagFnr(7)
        val id = sendInn(fnr)
        settOpprettetTilbake(id)
        db.usendteSoeknader() shouldBe emptyList()

        kjoerTil { fullfoert(id) }

        tasks().map { it.type to it.status } shouldContainExactly MottakTasks.alle.map { it.navn to "FULLFØRT" }

        val (dokarkivSti, dokarkivBody) = kall.single { it.first.startsWith("dokarkiv") }
        dokarkivSti shouldBe "dokarkiv?forsoekFerdigstill=true"
        dokarkivBody!!["eksternReferanseId"].asString() shouldBe "etterlatte:omstillingsstoenad:$id"
        dokarkivBody["tittel"].asString() shouldBe "Søknad om utvidet omstillingsstønad"
        dokarkivBody["tema"].asString() shouldBe "EYO"
        dokarkivBody["journalfoerendeEnhet"].asString() shouldBe "4817"
        dokarkivBody["bruker"]["id"].asString() shouldBe fnr.value
        dokarkivBody["sak"]["fagsakId"].asString() shouldBe "42"
        dokarkivBody["dokumenter"][0]["dokumentvarianter"].values().map { it["variantformat"].asString() } shouldBe
            listOf("ARKIV", "ORIGINAL")
        kall.single { it.first.startsWith("pdfgen") }.first shouldBe
            "pdfgen/api/v1/genpdf/eypdfgen/utvidet_omstillingsstoenad_v1"
        kall.single { it.first == "gjenny-kontekst" }.second!!["foedselsnummer"].asString() shouldBe fnr.value
        val overlevering = kall.single { it.first == "gjenny-overlevering" }.second!!
        overlevering["mottaksnoekkel"].asString() shouldBe "innsendt-soeknad:$id"
        overlevering["journalpostId"].asString() shouldBe "123456789"
        overlevering["sakId"].asLong() shouldBe 42

        rapid.inspektør.size shouldBe 1
        val melding = rapid.inspektør.message(0)
        melding["@event_name"].asString() shouldBe "soeknad_innsendt"
        melding[MOTTAKSFLYT_NOEKKEL].asString() shouldBe "PROSESSERING"
        melding["@dokarkivRetur"]["journalpostId"].asString() shouldBe "123456789"
        melding["@dokarkivRetur"]["dokumenter"][0]["dokumentInfoId"].asString() shouldBe "111"
        melding["@skjema_info"].propertyNames().toSet() shouldBe setOf("type", "innsender")
        melding["@skjema_info"]["innsender"]["foedselsnummer"]["svar"].asString() shouldBe fnr.value
        melding["sakId"].asLong() shouldBe 42

        hendelser(id) shouldContainExactly listOf("FERDIGSTILT", "ARKIVERT")
        mottakFor(id).overlevering!!.oppgaveId shouldBe "oppgave-$id"

        db.slettArkiverteSoeknader() shouldBe 1
        antall("SELECT count(*) FROM innhold WHERE soeknad_id = $id") shouldBe 0
    }

    @Test
    fun `kompatibilitetseventet kvitteres ikke av gammel journalpost-river`() {
        val id = sendInn(lagFnr(8))
        kjoerTil { fullfoert(id) }
        val melding = rapid.inspektør.message(0).toString()

        val gammelRiver = TestRapid().apply { JournalpostSkrevet(this, db) }
        gammelRiver.sendTestMessage(melding)
        // Uten markøren stopper databasesjekken kvitteringen.
        gammelRiver.sendTestMessage(
            (mapper.readTree(melding) as ObjectNode).apply { remove(MOTTAKSFLYT_NOEKKEL) }.toString(),
        )

        hendelser(id) shouldContainExactly listOf("FERDIGSTILT", "ARKIVERT")
        gammelRiver.inspektør.size shouldBe 0
    }

    @Test
    fun `feil fra dokarkiv gir retry og STOPPET uten neste task, Kafka-fallback eller sletting`() {
        val fnr = lagFnr(9)
        dokarkiv = { Svar(HttpStatusCode.InternalServerError, """{"melding":"${fnr.value}"}""") }
        val id = sendInn(fnr)
        settOpprettetTilbake(id)

        kjoerTil { tasks().any { it.type == MottakTasks.JOURNALFOER.navn && it.status == "STOPPET" } }

        val journalfoer = tasks().single { it.type == MottakTasks.JOURNALFOER.navn }
        journalfoer.antallFeil shouldBe 3
        journalfoer.sisteFeilmelding shouldBe "DokarkivFeil: Dokarkiv svarte 500 ved journalføring"
        tasks().map { it.type } shouldBe
            listOf(MottakTasks.HENT_JOURNALFOERINGSKONTEKST.navn, MottakTasks.JOURNALFOER.navn)
        antall("SELECT count(*) FROM prosessering_task_hendelse WHERE melding LIKE '%${fnr.value}%'") shouldBe 0

        hendelser(id) shouldContainExactly listOf("FERDIGSTILT")
        db.usendteSoeknader() shouldBe emptyList()
        db.slettArkiverteSoeknader() shouldBe 0
        dataSource.connection.use {
            it
                .prepareStatement(
                    "UPDATE hendelse SET opprettet = now() - interval '5 days' WHERE soeknad_id = $id",
                ).executeUpdate()
        }
        db.slettUtgaatteKladder() shouldBe emptyList()
        antall("SELECT count(*) FROM innhold WHERE soeknad_id = $id") shouldBe 1
        rapid.inspektør.size shouldBe 0
    }

    @Test
    fun `409 fra dokarkiv bruker eksisterende journalpost`() {
        dokarkiv = { Svar(HttpStatusCode.Conflict, journalpostSvar("999")) }
        val id = sendInn(lagFnr(10))

        kjoerTil { fullfoert(id) }

        mottakFor(id).journalpost!!.journalpostId shouldBe "999"
        kall.single { it.first == "gjenny-overlevering" }.second!!["journalpostId"].asString() shouldBe "999"
    }

    @Test
    fun `tapt svar fra Gjenny gir nytt kall med samme innhold og ingen ny journalpost`() {
        val forsoek = AtomicInteger()
        gjennyOverlevering = {
            if (forsoek.incrementAndGet() ==
                1
            ) {
                Svar(HttpStatusCode.GatewayTimeout, "{}")
            } else {
                Svar(HttpStatusCode.OK, overleveringSvar(it))
            }
        }
        val id = sendInn(lagFnr(11))

        kjoerTil { fullfoert(id) }

        val overleveringer = kall.filter { it.first == "gjenny-overlevering" }.map { it.second!!.toString() }
        overleveringer.size shouldBe 2
        overleveringer.distinct().size shouldBe 1
        kall.count { it.first.startsWith("dokarkiv") } shouldBe 1
        val task = tasks().single { it.type == MottakTasks.OVERLEVER_TIL_GJENNY.navn }
        task.antallFeil shouldBe 1
        task.sisteFeilmelding shouldBe
            "GjennyUtilgjengelig: Gjenny svarte 504 på ${GjennyMottakKlient.OVERLEVERING_STI}"
    }

    @Test
    fun `toggle av under kjoering beholder paabegynt mottak i prosessering, mens nye soeknader gaar til Kafka`() {
        val paabegynt = sendInn(lagFnr(12))
        toggle.paa = false
        val ny = sendInn(lagFnr(13))

        kjoerTil { fullfoert(paabegynt) }

        db.mottaksflyt(paabegynt) shouldBe Mottaksflyt.PROSESSERING
        db.mottaksflyt(ny) shouldBe Mottaksflyt.KAFKA
        tasks().map { it.payload }.distinct() shouldBe listOf("""{"soeknadId":$paabegynt}""")
    }

    @Test
    fun `ukjent bruker journalfoeres uten sak og bruker, og overleveres ikke til Gjenny (B4)`() {
        gjennyKontekst = { Svar(HttpStatusCode.OK, kontekstSvar(ukjent = true)) }
        val id = sendInn(lagFnr(14))

        kjoerTil { fullfoert(id) }

        val (sti, body) = kall.single { it.first.startsWith("dokarkiv") }
        sti shouldBe "dokarkiv?forsoekFerdigstill=false"
        body!!.has("bruker") shouldBe false
        body.has("avsenderMottaker") shouldBe false
        body.has("sak") shouldBe false
        body["journalfoerendeEnhet"].asString() shouldBe "4808"
        kall.none { it.first == "gjenny-overlevering" } shouldBe true
        mottakFor(id).overlevering!!.oppgaveId shouldBe null
        rapid.inspektør.message(0).has("sakId") shouldBe false
    }

    @Test
    fun `steg avviser soeknad som ikke tilhoerer prosesseringsflyten`() {
        toggle.paa = false
        val id = sendInn(lagFnr(15))
        mottak.prosessering.produsent.opprettIEgenTransaksjon(
            MottakTasks.HENT_JOURNALFOERINGSKONTEKST,
            SoeknadTaskPayload(id),
        )

        kjoerTil { tasks().single().status == "STOPPET" }

        tasks().single().sisteFeilmelding shouldBe
            "IllegalStateException: Søknad $id tilhører mottaksflyt KAFKA, ikke prosessering"
        kall shouldBe emptyList()
    }

    private fun nyttMottak() =
        SoeknadMottakKontekst(
            konfig = testKonfig,
            dataSource = dataSource,
            soeknader = db,
            rapid = { rapid },
            toggles = toggle,
            gjennyHttpClient = mockKlient(),
            dokarkivHttpClient = mockKlient(),
            pdfgenHttpClient = mockKlient(),
            pollIntervall = 50.milliseconds,
            retry = RetryPolicy(maxAntallFeil = 3, backoff = { 100.milliseconds }),
        )

    private fun sendInn(
        fnr: Foedselsnummer,
        soeknad: InnsendtSoeknad = InnsendtSoeknadFixtures.utvidetOmstillingsstoenad(innsenderFnr = fnr),
        kilde: String = this.kilde,
    ): SoeknadID {
        runBlocking { service.sendSoeknad(fnr, SoeknadRequest(listOf(soeknad)), kilde) } shouldBe true
        return antall("SELECT max(id) FROM soeknad").toLong()
    }

    private fun kjoerTil(betingelse: () -> Boolean) {
        mottak.prosessering.start()
        val frist = System.currentTimeMillis() + 20_000
        while (!betingelse()) {
            check(System.currentTimeMillis() < frist) { "Betingelsen ble ikke oppfylt. Tasks: ${tasks()}" }
            Thread.sleep(50)
        }
    }

    private fun fullfoert(id: SoeknadID) = dataSource.connection.use { mottakDao.hent(it, id)?.fullfoert != null }

    private fun mottakFor(id: SoeknadID) = dataSource.connection.use { mottakDao.hent(it, id)!! }

    private fun settOpprettetTilbake(id: SoeknadID) =
        dataSource.connection.use {
            it
                .prepareStatement(
                    "UPDATE soeknad SET opprettet = now() - interval '3 hours' WHERE id = $id",
                ).executeUpdate()
        }

    private fun antall(sql: String) =
        dataSource.connection.use {
            it
                .prepareStatement(sql)
                .executeQuery()
                .also { rs -> rs.next() }
                .getInt(1)
        }

    private fun hendelser(id: SoeknadID) =
        dataSource.connection.use {
            val rs =
                it
                    .prepareStatement(
                        "SELECT status_id FROM hendelse WHERE soeknad_id = $id ORDER BY id",
                    ).executeQuery()
            buildList { while (rs.next()) add(rs.getString(1)) }
        }

    private data class TaskRad(
        val type: String,
        val status: String,
        val payload: String,
        val metadata: String?,
        val antallFeil: Int,
        val sisteFeilmelding: String?,
    )

    private fun tasks() =
        dataSource.connection.use {
            val rs =
                it
                    .prepareStatement(
                        "SELECT type, status, payload, metadata::text, antall_feil, siste_feilmelding FROM prosessering_task ORDER BY id",
                    ).executeQuery()
            buildList {
                while (rs.next()) {
                    add(
                        TaskRad(
                            rs.getString(1),
                            rs.getString(2),
                            rs.getString(3),
                            rs.getString(4),
                            rs.getInt(5),
                            rs.getString(6),
                        ),
                    )
                }
            }
        }

    private data class Svar(
        val status: HttpStatusCode,
        val body: String,
    )

    private fun MockRequestHandleScope.svar(svar: Svar): HttpResponseData =
        respond(svar.body, svar.status, headersOf(HttpHeaders.ContentType, "application/json"))

    private fun mockKlient() =
        HttpClient(
            MockEngine { request ->
                val bytes = request.body.toByteArray()
                val body = if (bytes.isEmpty()) null else runCatching { mapper.readTree(bytes) }.getOrNull()
                val sti = request.url.encodedPath
                when {
                    sti.endsWith(GjennyMottakKlient.KONTEKST_STI) -> {
                        kall.add("gjenny-kontekst" to body)
                        svar(gjennyKontekst(body!!))
                    }

                    sti.endsWith(GjennyMottakKlient.OVERLEVERING_STI) -> {
                        kall.add("gjenny-overlevering" to body)
                        svar(gjennyOverlevering(body!!))
                    }

                    request.url.host == "dokarkiv" -> {
                        kall.add("dokarkiv?${request.url.encodedQuery}" to body)
                        svar(dokarkiv(body!!))
                    }

                    request.url.host == "pdfgen" -> {
                        kall.add("pdfgen$sti" to body)
                        respond(byteArrayOf(37, 80, 68, 70), HttpStatusCode.OK)
                    }

                    else -> {
                        error("Uventet kall til ${request.url}")
                    }
                }
            },
        ) {
            install(ContentNegotiation) {
                jackson { changeDefaultPropertyInclusion { it.withValueInclusion(JsonInclude.Include.NON_NULL) } }
            }
        }

    private fun kontekstSvar(ukjent: Boolean) =
        if (ukjent) {
            """{"ukjentBruker":true,"sakId":null,"sakType":"OMSTILLINGSSTOENAD","tema":"EYO","journalfoerendeEnhet":"4808"}"""
        } else {
            """{"ukjentBruker":false,"sakId":42,"sakType":"OMSTILLINGSSTOENAD","tema":"EYO","journalfoerendeEnhet":"4817"}"""
        }

    private fun overleveringSvar(request: JsonNode): String {
        val noekkel = request["mottaksnoekkel"].asString()
        return """{"mottaksnoekkel":"$noekkel","sakId":${request["sakId"].asLong()},""" +
            """"journalpostId":"${request["journalpostId"].asString()}","oppgaveId":"oppgave-${noekkel.substringAfter(
                ":",
            )}"}"""
    }

    private fun journalpostSvar(journalpostId: String) =
        """{"journalpostId":"$journalpostId","journalpostferdigstilt":true,"dokumenter":[{"dokumentInfoId":"111"}]}"""

    private class FakeToggles : FeatureToggleService {
        @Volatile var paa = true

        override fun isEnabled(
            toggleId: FeatureToggle,
            defaultValue: Boolean,
            context: UnleashContext?,
        ) = toggleId == MottakToggle.UTVIDET_OMS_PROSESSERING && paa
    }

    companion object {
        val testKonfig =
            MottakKonfig(
                etterlatteApiUrl = "http://etterlatte-api",
                etterlatteApiScope = "api://etterlatte-api/.default",
                dokarkivUrl = "http://dokarkiv/rest/journalpostapi/v1/journalpost",
                dokarkivScope = "api://dokarkiv/.default",
                pdfgenrsUrl = "http://pdfgen/api/v1/genpdf",
                unleash = FeatureToggleProperties("innsendt-soeknad", "http://unleash", "token"),
                prosesseringRolleGruppe = "prosessering-gruppe",
                azureWellKnownUrl = "http://azure/.well-known",
                azureClientId = "innsendt-soeknad",
                node = "test",
            )

        /** Gyldig fødselsnummer (mod 11) for en testperson født 1. januar 1980. */
        fun lagFnr(nr: Int): Foedselsnummer {
            var individ = 100 + nr * 7
            while (true) {
                val base = "010180%03d".format(individ)
                val d = base.map { it.digitToInt() }
                val k1 = (11 - listOf(3, 7, 6, 1, 8, 9, 4, 5, 2).zip(d).sumOf { (a, b) -> a * b } % 11) % 11
                val k2 = (11 - listOf(5, 4, 3, 2, 7, 6, 5, 4, 3, 2).zip(d + k1).sumOf { (a, b) -> a * b } % 11) % 11
                if (k1 < 10 && k2 < 10) return Foedselsnummer.of("$base$k1$k2")
                individ++
            }
        }
    }
}