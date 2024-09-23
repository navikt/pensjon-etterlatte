package libs.common.util

import kotlinx.coroutines.runBlocking
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertThrows
import org.junit.jupiter.api.Assertions.fail
import org.junit.jupiter.api.Test
import java.util.LinkedList

class RetryTest {
    @Test
    fun `unsafe retry skal gi resultatet om det gikk bra`() {
        assertEquals(
            "OK",
            runBlocking {
                unsafeRetry(2, ustabilMetode(listOf(true, true, false)))
            },
        )
    }

    @Test
    fun `unsafe retry skal kaste feil etter et visst antall retries`() {
        assertThrows(IllegalStateException::class.java) {
            runBlocking {
                unsafeRetry(2, ustabilMetode(listOf(true, true, true, false)))
            }
        }
    }

    @Test
    fun `Skal forsøke på nytt når det feiler`() {
        runBlocking {
            unsafeRetry(2, ustabilMetode(listOf(true, true, false)))
        }.also {
            when (it) {
                is RetryResult.Success -> {
                    assertEquals("OK", it.content)
                    assertEquals(2, it.previousExceptions.size)
                }
                is RetryResult.Failure -> fail()
            }
        }
    }

    @Test
    fun `exceptions blir lagt til i lista som suppressed, den nyeste foerst`() {
        val e1 = RuntimeException("e1")
        val e2 = RuntimeException("e2")
        val e3 = RuntimeException("e3")

        val samla = samleExceptions(listOf(e1, e2, e3))
        assertEquals(e3, samla)
        assertEquals(listOf(e2, e1), samla.suppressedExceptions)
    }

    private fun ustabilMetode(eksternFeil: List<Boolean>): suspend () -> String {
        LinkedList<Boolean>().apply {
            addAll(eksternFeil)
            return suspend {
                if (pop()) throw IllegalStateException()
                "OK"
            }
        }
    }
}