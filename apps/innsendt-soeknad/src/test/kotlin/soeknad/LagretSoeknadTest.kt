package soeknad

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.fasterxml.jackson.module.kotlin.jacksonTypeRef
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test

internal class LagretSoeknadTest {

    private val mapper = jacksonObjectMapper()

    @Test
    fun serde() {
        val soeknad = LagretSoeknad(1, "123456", "payload").apply { status = Status.LAGRETKLADD }

        val serialized = mapper.writeValueAsString(soeknad)

        assertFalse(Status.LAGRETKLADD.name in serialized)

        val deserialized = mapper.readValue(serialized, jacksonTypeRef<LagretSoeknad>())

        assertEquals(soeknad.id, deserialized.id)
        assertEquals(soeknad.fnr, deserialized.fnr)
        assertEquals(soeknad.payload, deserialized.payload)
        assertNull(deserialized.status)
    }

}
