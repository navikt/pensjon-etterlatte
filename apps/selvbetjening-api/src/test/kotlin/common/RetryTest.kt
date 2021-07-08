package no.nav.etterlatte.common

import kotlinx.coroutines.runBlocking
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertThrows
import org.junit.jupiter.api.Test
import java.util.*
import kotlin.test.assertNull

class RetryTest {

    @Test
    fun `unsafe retry skal gi resultatet om det gikk bra`(){
        assertEquals("OK", runBlocking {
            unsafeRetry(2, ustabilMetode(listOf(true, true, false)))
        })
    }

    @Test
    fun `unsafe retry skal kaste feil etter et visst antall retries`(){
        assertThrows(IllegalStateException::class.java){
            runBlocking {
                unsafeRetry(2, ustabilMetode(listOf(true, true, true, false)))
            }
        }
    }

    @Test
    fun `skal forsøke på nytt`(){
        runBlocking {
            retry(2, ustabilMetode(listOf(true, true, false)))
        }.also {
            assertEquals("OK", it.first)
            assertEquals(2, it.second.size)
        }
    }

    @Test
    fun `skal ikke gi svar når alle forsøk feiler`(){
        runBlocking {
            retry(2, ustabilMetode(listOf(true, true, true, false)))
        }.also {
            assertNull(it.first)
            assertEquals(3, it.second.size)
        }

    }

    fun ustabilMetode(eksternFeil: List<Boolean>): suspend () -> String {
        LinkedList<Boolean>().apply {
            addAll(eksternFeil)
            return suspend {
                if(pop()) throw IllegalStateException()
                "OK"
            }
        }
    }
}