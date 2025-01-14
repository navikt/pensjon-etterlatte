package omsmeldinnendring

import io.kotest.matchers.shouldBe
import no.nav.etterlatte.DataSourceBuilder
import no.nav.etterlatte.libs.common.person.Foedselsnummer
import no.nav.etterlatte.omsendringer.OmsEndring
import no.nav.etterlatte.omsendringer.OmsMeldInnEndringRepository
import no.nav.etterlatte.omsendringer.OmsMeldtInnEndring
import no.nav.etterlatte.omsendringer.OmsMeldtInnEndringStatus
import opprettInMemoryDatabase
import org.junit.jupiter.api.AfterAll
import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.BeforeAll
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.TestInstance
import org.testcontainers.containers.PostgreSQLContainer
import org.testcontainers.junit.jupiter.Container
import java.util.UUID

@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class OmsMeldInnEndringRepositoryTest {
    @Container
    private val postgreSQLContainer = PostgreSQLContainer<Nothing>("postgres:14")
    private lateinit var repository: OmsMeldInnEndringRepository
    private lateinit var dsbHolder: DataSourceBuilder

    @BeforeAll
    fun beforeAll() {
        val (_, dsb) = opprettInMemoryDatabase(postgreSQLContainer)
        dsbHolder = dsb
        dsb.migrate()
        repository = OmsMeldInnEndringRepository(dsb.dataSource)
    }

    @AfterAll
    fun afterAll() {
        postgreSQLContainer.stop()
    }

    @AfterEach
    fun clear() {
        repository.ds.connection.use {
            it.prepareStatement("DELETE FROM oms_meld_inn_endring").execute()
        }
    }

    @Test
    fun `lagre endring`() {
        val endringer =
            OmsMeldtInnEndring(
                id = UUID.randomUUID(),
                fnr = Foedselsnummer.of("09038520129"),
                endring = OmsEndring.ANNET,
                beskrivelse = "Beskrivelse av alle endringer til bruker",
            )

        repository.lagreEndringer(endringer)
        val lagret = repository.hentEndring(endringer.id)

        lagret shouldBe endringer
    }

    @Test
    fun `hent med status og oppdater`() {
        val endring =
            OmsMeldtInnEndring(
                id = UUID.randomUUID(),
                fnr = Foedselsnummer.of("09038520129"),
                endring = OmsEndring.ANNET,
                beskrivelse = "Beskrivelse av alle endringer til bruker",
            )
        repository.lagreEndringer(endring)

        val lagret = repository.hentEndringerMedStatus(OmsMeldtInnEndringStatus.LAGRET)
        lagret shouldBe listOf(endring)

        repository.oppdaterStatusForId(endring.id, OmsMeldtInnEndringStatus.SENDT)

        val sendt = repository.hentEndringerMedStatus(OmsMeldtInnEndringStatus.SENDT)
        sendt shouldBe listOf(endring)
    }
}