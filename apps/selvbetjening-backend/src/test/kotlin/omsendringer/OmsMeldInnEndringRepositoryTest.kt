package omsendringer

import io.kotest.matchers.shouldBe
import no.nav.etterlatte.DataSourceBuilder
import no.nav.etterlatte.libs.common.person.Foedselsnummer
import no.nav.etterlatte.omsendringer.OmsEndringType
import no.nav.etterlatte.omsendringer.OmsMeldInnEndringRepository
import no.nav.etterlatte.omsendringer.OmsMeldtInnEndring
import opprettInMemoryDatabase
import org.junit.jupiter.api.AfterAll
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

    @Test
    fun `lagre endring`() {
        val endringer =
            OmsMeldtInnEndring(
                id = UUID.randomUUID(),
                fnr = Foedselsnummer.of("09038520129"),
                type = OmsEndringType.ANNET,
                endringer = "Beskrivelse av alle endringer til bruker",
            )

        repository.lagreEndringer(endringer)
        val lagret = repository.hentEndring(endringer.id)

        lagret shouldBe endringer
    }
}