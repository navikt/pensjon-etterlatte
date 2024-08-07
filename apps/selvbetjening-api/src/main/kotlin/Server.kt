package no.nav.etterlatte

import com.fasterxml.jackson.databind.DeserializationFeature
import com.fasterxml.jackson.databind.SerializationFeature
import com.fasterxml.jackson.databind.module.SimpleModule
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule
import io.ktor.serialization.jackson.jackson
import io.ktor.server.application.install
import io.ktor.server.cio.CIO
import io.ktor.server.engine.applicationEngineEnvironment
import io.ktor.server.engine.connector
import io.ktor.server.engine.embeddedServer
import io.ktor.server.metrics.micrometer.MicrometerMetrics
import io.ktor.server.plugins.callloging.CallLogging
import io.ktor.server.plugins.contentnegotiation.ContentNegotiation
import io.ktor.server.request.header
import io.ktor.server.request.path
import io.ktor.server.routing.routing
import io.micrometer.core.instrument.binder.jvm.JvmMemoryMetrics
import io.micrometer.core.instrument.binder.logging.LogbackMetrics
import io.micrometer.core.instrument.binder.system.ProcessorMetrics
import io.micrometer.core.instrument.binder.system.UptimeMetrics
import no.nav.etterlatte.common.LocalDateSerializer
import no.nav.etterlatte.internal.Metrikker
import no.nav.etterlatte.internal.healthApi
import no.nav.etterlatte.internal.metricsApi
import no.nav.etterlatte.internal.selftestApi
import no.nav.etterlatte.kodeverk.kodeverkApi
import no.nav.etterlatte.ktortokenexchange.installAuthUsing
import no.nav.etterlatte.ktortokenexchange.secureRoutUsing
import no.nav.etterlatte.libs.utils.logging.CORRELATION_ID
import no.nav.etterlatte.libs.utils.logging.X_CORRELATION_ID
import no.nav.etterlatte.person.personApi
import no.nav.etterlatte.soknad.soknadApi
import org.slf4j.event.Level
import java.time.LocalDate
import java.util.UUID

class Server(
    applicationContext: ApplicationContext
) {
    private val personService = applicationContext.personService
    private val securityContext = applicationContext.securityMediator
    private val soeknadService = applicationContext.soeknadService
    private val kodeverkService = applicationContext.kodeverkService
    private val unsecuredSoeknadHttpClient = applicationContext.unsecuredSoeknadHttpClient

    private val engine =
        embeddedServer(
            CIO,
            environment =
                applicationEngineEnvironment {
                    module {
                        install(ContentNegotiation) {
                            jackson {
                                enable(DeserializationFeature.READ_UNKNOWN_ENUM_VALUES_AS_NULL)
                                disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES)
                                disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS)
                                registerModule(JavaTimeModule())
                                registerModule(
                                    SimpleModule().addDeserializer(LocalDate::class.java, LocalDateSerializer())
                                )
                            }
                        }
                        installAuthUsing(securityContext)

                        install(CallLogging) {
                            level = Level.INFO
                            disableDefaultColors()
                            filter { call -> !call.request.path().startsWith("/internal") }
                            mdc(CORRELATION_ID) { call ->
                                call.request.header(X_CORRELATION_ID)
                                    ?: UUID.randomUUID().toString()
                            }
                        }

                        install(MicrometerMetrics) {
                            registry = Metrikker.registry
                            meterBinders =
                                listOf(
                                    LogbackMetrics(),
                                    JvmMemoryMetrics(),
                                    ProcessorMetrics(),
                                    UptimeMetrics()
                                )
                        }

                        routing {
                            healthApi()
                            metricsApi()
                            selftestApi(unsecuredSoeknadHttpClient)
                            secureRoutUsing(securityContext) {
                                personApi(personService)
                                soknadApi(soeknadService)
                                kodeverkApi(kodeverkService)
                            }
                        }
                    }
                    connector { port = 8080 }
                }
        )

    fun run() = engine.start(true)
}