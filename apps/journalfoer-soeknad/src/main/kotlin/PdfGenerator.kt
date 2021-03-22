package no.nav.etterlatte

import com.fasterxml.jackson.databind.node.ObjectNode
import io.ktor.client.HttpClient
import io.ktor.client.request.header
import io.ktor.client.request.post
import org.slf4j.MDC
import java.util.*

internal const val suPdfGenPath = "/api/v1/genpdf/supdfgen"
//internal const val SOKNAD_TEMPLATE = "soknad"
internal const val baseUrl = "hvorfinnerjegPGFGEN!"

class PdfGenerator(private val client: HttpClient, private val apiUrl: String) : GenererPdf {


    override suspend fun genererPdf(input: String, template: String) : ByteArray {
        val apiUrl = "$baseUrl$template"
        return client.post<ObjectNode>(apiUrl) {
            header("Content-Type", "application/json")
            header("X-Correlation-ID", MDC.get("X-Correlation-ID") ?: UUID.randomUUID().toString())
            body =  input
        }.let {
            it.binaryValue()
        }
    }



    //private val log: Logger = LoggerFactory.getLogger(this::class.java)
/*
    override fun genererPdf(søknadPdfInnhold: SøknadPdfInnhold): Either<ClientError, ByteArray> {
        return genererPdf(objectMapper.writeValueAsString(søknadPdfInnhold), SOKNAD_TEMPLATE)
    }

    override fun genererPdf(brevInnhold: BrevInnhold): Either<KunneIkkeGenererePdf, ByteArray> {
        return genererPdf(brevInnhold.toJson(), brevInnhold.brevTemplate.template())
            .mapLeft { KunneIkkeGenererePdf }
    }

 */
}
