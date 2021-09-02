package no.nav.etterlatte

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import io.ktor.client.HttpClient
import io.ktor.client.engine.cio.CIO
import io.ktor.client.request.get
import org.slf4j.LoggerFactory
import java.net.InetAddress

object LeaderElection {
    private val logger = LoggerFactory.getLogger("no.pensjon.etterlatte")
    private val electorPath: String? = System.getenv("ELECTOR_PATH")
    private val httpClient = HttpClient(CIO)
    private val objectMapper = jacksonObjectMapper()
    private val me:String?  = InetAddress.getLocalHost().hostName
    suspend fun isLeader(): Boolean{
        val leader = httpClient.get<String>("http://$electorPath").let (objectMapper::readTree).get("name").asText()
        val amLeader = leader == me
        logger.info("Current pod: $me. Leader: $leader. Current pod is leader: $amLeader")
        return amLeader
    }
}