package no.nav.etterlatte

import com.fasterxml.jackson.databind.node.ObjectNode
import io.ktor.client.HttpClient
import io.ktor.client.request.header
import io.ktor.client.request.post
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.slf4j.MDC
import java.util.*

//internal const val suPdfGenPath = "/api/v1/genpdf/supdfgen"
//internal const val SOKNAD_TEMPLATE = "soknad"

class Journalfoer(private val client: HttpClient, private val apiUrl: String) : JournalfoerDok {


    private val log: Logger = LoggerFactory.getLogger(this::class.java)

    override suspend fun journalfoerDok(metadata: String, pdf: ByteArray) : String {
        val apiUrl = "hvorfinnerjegDokarkiv"
        return client.post<ObjectNode>(apiUrl) {
            header("Content-Type", "application/json")
            header("X-Correlation-ID", MDC.get("X-Correlation-ID") ?: UUID.randomUUID().toString())
            body =  pdf
        }.let {
            "JournalpostID"
            //it.get("journalpostID"):
        }
    }
}
