object NavFelles {
    const val RapidAndRivers = "com.github.navikt:rapids-and-rivers:2022061809451655538329.d6deccc62862"
    const val TokenClientCore = "no.nav.security:token-client-core:2.1.2"
    const val TokenValidationKtor = "no.nav.security:token-validation-ktor-v2:2.1.2"
    const val MockOauth2Server = "no.nav.security:mock-oauth2-server:0.3.1"
}

object Etterlatte {
    const val Common = "no.nav.etterlatte:common:2022.09.27-14.09.182856a1fda5"
    const val CommonTest = "no.nav.etterlatte:common-test:2022.09.27-14.10.182856a1fda5"
    const val KtorClientAuth = "no.nav.etterlatte:ktor-client-auth:2022.09.28-10.09.cce630926582"
}

object Kotlinx {
    const val CoroutinesCore = "org.jetbrains.kotlinx:kotlinx-coroutines-core:1.6.4"
}

object Ktor {
    private const val version = "2.0.3"

    const val ServerAuth = "io.ktor:ktor-server-auth:$version"
    const val CallLogging = "io.ktor:ktor-server-call-logging:$version"
    const val ClientCore = "io.ktor:ktor-client-core:$version"
    const val ClientAuth = "io.ktor:ktor-client-auth:$version"
    const val ClientContentNegotiation = "io.ktor:ktor-client-content-negotiation:$version"
    const val ClientLogging = "io.ktor:ktor-client-logging:$version"
    const val ClientCioJvm = "io.ktor:ktor-client-cio-jvm:$version"
    const val Jackson = "io.ktor:ktor-serialization-jackson:$version"
    const val MetricsMicrometer = "io.ktor:ktor-server-metrics-micrometer:$version"
    const val OkHttp = "io.ktor:ktor-client-okhttp:$version"
    const val ServerCore = "io.ktor:ktor-server-core:$version"
    const val ServerCio = "io.ktor:ktor-server-cio:$version"
    const val ServerContentNegotiation = "io.ktor:ktor-server-content-negotiation:$version"

    const val ClientMock = "io.ktor:ktor-client-mock:$version"
    const val ServerTests = "io.ktor:ktor-server-tests:$version"
}

object Jackson {
    private const val version = "2.13.4"

    const val DatatypeJsr310 = "com.fasterxml.jackson.datatype:jackson-datatype-jsr310:$version"
    const val DatatypeJdk8 = "com.fasterxml.jackson.datatype:jackson-datatype-jdk8:$version"
    const val ModuleKotlin = "com.fasterxml.jackson.module:jackson-module-kotlin:$version"
}

object Jupiter {
    private const val version = "5.9.1"

    const val Api = "org.junit.jupiter:junit-jupiter-api:$version"
    const val Params = "org.junit.jupiter:junit-jupiter-params:$version"
    const val Engine = "org.junit.jupiter:junit-jupiter-engine:$version"
}

object Logging {
    const val Slf4jApi = "org.slf4j:slf4j-api:2.0.2"
    const val LogbackClassic = "ch.qos.logback:logback-classic:1.4.1"
    const val LogstashLogbackEncoder = "net.logstash.logback:logstash-logback-encoder:7.2"
}

object Micrometer {
    const val Prometheus = "io.micrometer:micrometer-registry-prometheus:1.9.4"
}

object MockK {
    const val MockK = "io.mockk:mockk:1.13.1"
}

object Kotest {
    private const val version = "5.4.2"

    const val AssertionsCore = "io.kotest:kotest-assertions-core:$version"
}
