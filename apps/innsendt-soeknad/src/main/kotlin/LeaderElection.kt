package no.nav.etterlatte

import com.fasterxml.jackson.databind.JsonNode
import io.ktor.client.HttpClient
import io.ktor.client.engine.cio.CIO
import io.ktor.client.request.get
import org.slf4j.LoggerFactory
import java.net.InetAddress

object LeaderElection {
    val logger = LoggerFactory.getLogger("no.pensjon.etterlatte")
    private  val electorPath: String? = System.getenv("ELECTOR_PATH")
    private val httpClient = HttpClient(CIO)
    suspend fun isLeader(): Boolean{
        val leader = httpClient.get<JsonNode>("http://$electorPath").get("name").asText()
        val me = InetAddress.getLocalHost().getHostName()
        val amLeader = leader == me
        logger.info("Current pod: $me. Leader: $leader. Current pod is leader: $amLeader")
        return amLeader
    }
}