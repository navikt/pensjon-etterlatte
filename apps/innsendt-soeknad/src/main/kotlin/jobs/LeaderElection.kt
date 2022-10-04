package no.nav.etterlatte.jobs

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import io.ktor.client.HttpClient
import io.ktor.client.call.body
import io.ktor.client.engine.cio.CIO
import io.ktor.client.request.get
import org.slf4j.LoggerFactory
import java.net.InetAddress

internal object LeaderElection {
    private val logger = LoggerFactory.getLogger(LeaderElection::class.java)

    private val electorPath: String? = System.getenv("ELECTOR_PATH")
    private val httpClient = HttpClient(CIO)
    private val objectMapper = jacksonObjectMapper()
    private val me: String? = InetAddress.getLocalHost().hostName
    suspend fun isLeader(): Boolean {
        val leader = httpClient.get("http://$electorPath").body<String>()
            .let(objectMapper::readTree).get("name").asText()
        val amLeader = leader == me
        logger.info("Current pod: $me. Leader: $leader. Current pod is leader: $amLeader")
        return amLeader
    }
}
