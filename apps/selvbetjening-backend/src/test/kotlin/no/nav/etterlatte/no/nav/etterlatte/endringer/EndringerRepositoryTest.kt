package no.nav.etterlatte.no.nav.etterlatte.endringer

import io.kotest.matchers.shouldBe
import no.nav.etterlatte.DataSourceBuilder
import no.nav.etterlatte.endringer.EndringType
import no.nav.etterlatte.endringer.Endringer
import no.nav.etterlatte.libs.common.person.Foedselsnummer
import no.nav.etterlatte.no.nav.etterlatte.no.nav.etterlatte.endringer.EndringerRepository
import opprettInMemoryDatabase
import org.junit.jupiter.api.AfterAll
import org.junit.jupiter.api.BeforeAll
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.TestInstance
import org.testcontainers.containers.PostgreSQLContainer
import org.testcontainers.junit.jupiter.Container
import java.time.Instant
import java.util.UUID

@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class EndringerRepositoryTest {
    @Container
    private val postgreSQLContainer = PostgreSQLContainer<Nothing>("postgres:14")
    private lateinit var repository: EndringerRepository
    private lateinit var dsbHolder: DataSourceBuilder

    @BeforeAll
    fun beforeAll() {
        val (_, dsb) = opprettInMemoryDatabase(postgreSQLContainer)
        dsbHolder = dsb
        dsb.migrate()
        repository = EndringerRepository(dsb.dataSource)
    }

    @AfterAll
    fun afterAll() {
        postgreSQLContainer.stop()
    }

    @Test
    fun `lagre endring`() {
        val endringer =
            Endringer(
                id = UUID.randomUUID(),
                fnr = Foedselsnummer.of("09038520129"),
                type = EndringType.ANNET,
                endringer = "Beskrivelse av alle endringer til bruker",
                tidspunkt = Instant.now(),
            )

        repository.lagreEndringer(endringer)
        val lagret = repository.hentEndring(endringer.id)

        lagret shouldBe endringer
    }
}