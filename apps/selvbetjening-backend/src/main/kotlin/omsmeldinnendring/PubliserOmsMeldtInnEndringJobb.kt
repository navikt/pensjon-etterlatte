package no.nav.etterlatte.omsendringer

import com.github.navikt.tbd_libs.rapids_and_rivers.JsonMessage
import kotlinx.coroutines.runBlocking
import no.nav.etterlatte.funksjonsbrytere.FeatureToggle
import no.nav.etterlatte.funksjonsbrytere.FeatureToggleService
import no.nav.etterlatte.jobs.LeaderElection
import no.nav.etterlatte.kafka.KafkaProdusent
import no.nav.etterlatte.libs.common.omsmeldinnendring.OmsMeldtInnEndring
import no.nav.etterlatte.libs.common.omsmeldinnendring.OmsMeldtInnEndringStatus
import no.nav.etterlatte.shuttingDown
import org.slf4j.LoggerFactory
import java.time.Duration
import java.time.temporal.ChronoUnit
import java.util.Timer
import java.util.UUID
import kotlin.concurrent.fixedRateTimer

enum class OmsMeldtInnEndringToggles(
    val value: String,
) : FeatureToggle {
    PUBLISER_OMS_MELDT_INN_ENDRING("publiser-oms-meldt-inn-endring"),
    ;

    override fun key(): String = this.value
}

class PubliserOmsMeldtInnEndringJobb(
    private val rapid: KafkaProdusent<String, String>,
    private val service: OmsMeldInnEndringService,
    private val toggles: FeatureToggleService,
) {
    private val logger = LoggerFactory.getLogger(PubliserOmsMeldtInnEndringJobb::class.java)

    fun schedule(): Timer? {
        if (!toggles.isEnabled(
                OmsMeldtInnEndringToggles.PUBLISER_OMS_MELDT_INN_ENDRING,
                defaultValue = false,
            )
        ) {
            return null
        }

        logger.info("Setter opp ${this.javaClass.simpleName}")

        return fixedRateTimer(
            name = this.javaClass.simpleName,
            initialDelay = Duration.of(3, ChronoUnit.MINUTES).toMillis(),
            period = Duration.of(15, ChronoUnit.MINUTES).toMillis(),
        ) {
            runBlocking {
                if (LeaderElection.isLeader() && !shuttingDown.get()) {
                    publiserNyeOgIkkeFerdigstilte()
                }
            }
        }
    }

    fun publiserNyeOgIkkeFerdigstilte() =
        runCatching {
            val nyeEndringer =
                service.hentEndringerMedStatus(
                    OmsMeldtInnEndringStatus.LAGRET,
                )

            val forsoektPubliserteEndringer =
                service.hentEndringerMedStatus(
                    OmsMeldtInnEndringStatus.SENDT,
                )

            nyeEndringer.forEach { publiser(it) }

            forsoektPubliserteEndringer.forEach {
                logger.warn(
                    "Omstillingstønad meldt inn endring tidligere sendt til Gjenny sendes på nytt med id=${it.id}",
                )

                // TODO: Legg på denne igjen når vi har fått gått opp og kartlagt hva som går galt
                // publiser(it)
            }
        }.onFailure { e ->
            logger.error("Feil oppsto under jobb for publisering av meldt inn endring omstillingstønad: ", e)
        }

    private fun publiser(endring: OmsMeldtInnEndring) {
        runCatching {
            val melding = opprettMelding(endring)
            rapid.publiser(UUID.randomUUID().toString(), melding.toJson())
            service.oppdaterStatusForId(
                endring.id,
                OmsMeldtInnEndringStatus.SENDT,
            )
            logger.info("Meldt inn endring omstillingstønad er sendt til Gjenny id: ${endring.id}")
        }.onFailure { e ->
            logger.error(
                "Feil oppsto under publisering av meldt inn endring omstillingstønad for id: ${endring.id}",
                e,
            )
        }
    }

    private fun opprettMelding(endring: OmsMeldtInnEndring): JsonMessage =
        JsonMessage.newMessage(
            mapOf(
                "@event_name" to "oms_meldt_inn_endring",
                "@oms_meldt_inn_endring_innhold" to endring,
            ),
        )
}