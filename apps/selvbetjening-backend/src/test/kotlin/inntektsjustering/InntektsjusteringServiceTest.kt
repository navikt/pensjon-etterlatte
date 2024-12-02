package inntektsjustering

import io.mockk.clearMocks
import io.mockk.every
import io.mockk.mockk
import io.mockk.verify
import no.nav.etterlatte.inntektsjustering.InntektsjusteringLagre
import no.nav.etterlatte.inntektsjustering.InntektsjusteringRepository
import no.nav.etterlatte.inntektsjustering.InntektsjusteringService
import no.nav.etterlatte.inntektsjustering.InntektsjusteringStatus
import no.nav.etterlatte.libs.common.inntektsjustering.Inntektsjustering
import no.nav.etterlatte.libs.common.person.Foedselsnummer
import org.junit.jupiter.api.BeforeAll
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.TestInstance
import java.util.UUID

@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class InntektsjusteringServiceTest {
    private lateinit var service: InntektsjusteringService
    private var repository = mockk<InntektsjusteringRepository>()
    val inntektsjusteringLagreMock = mockk<InntektsjusteringLagre>()
    val inntektsjusteringResponseMock = mockk<Inntektsjustering>()
    val fnr = mockk<Foedselsnummer>()

    @BeforeAll
    fun beforeAll() {
        service = InntektsjusteringService(repository)
    }

    @BeforeEach
    fun setup() {
        clearMocks(repository, inntektsjusteringLagreMock, inntektsjusteringResponseMock, fnr)
    }

    @Test
    fun `lagre inntektsjustering`() {
        every { repository.hentInntektsjusteringForFnrOgStatus(fnr, any()) } returns null
        every { repository.lagreInntektsjustering(fnr, any()) } returns true
        service.lagreInntektsjustering(fnr, inntektsjusteringLagreMock)
        verify(exactly = 1) { repository.lagreInntektsjustering(any(), inntektsjusteringLagreMock) }
        verify(exactly = 0) { repository.oppdaterInntektsjustering(any(), inntektsjusteringLagreMock) }
    }

    @Test
    fun `oppdater inntektsjustering hvis den eksisterer`() {
        val id = mockk<UUID>()
        every { repository.hentInntektsjusteringForFnrOgStatus(fnr, InntektsjusteringStatus.LAGRET) } returns
            inntektsjusteringResponseMock
        every { inntektsjusteringResponseMock.id } returns id
        every { repository.oppdaterInntektsjustering(id, any()) } returns 1

        service.lagreInntektsjustering(fnr, inntektsjusteringLagreMock)
        verify(exactly = 1) { repository.oppdaterInntektsjustering(id, inntektsjusteringLagreMock) }
        verify(exactly = 0) { repository.lagreInntektsjustering(any(), inntektsjusteringLagreMock) }
    }
}