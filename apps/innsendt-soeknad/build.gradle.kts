plugins {
    id("etterlatte.rapids-and-rivers")
}

dependencies {
    implementation(etterlatte.common)

    implementation(database.hikaricp)
    implementation(database.flywaycore)
    implementation(database.postgresql)
    implementation(navfelles.token.validation.ktor)

    implementation(ktor.server.auth)
    implementation(ktor.server.content.negotiation)
    implementation(ktor.serialization.jackson)
    implementation(ktor.client.core)
    implementation(ktor.server.call.logging)
    implementation(Ktor.client.content.negotiation)
    implementation(Ktor.client.cio.jvm)

    testImplementation(etterlatte.common.test)
    testImplementation(testcontainers.junit.jupiter)
    testImplementation(testcontainers.postgresql)

    testImplementation(ktor.server.tests)
    testImplementation(kotest.assertions.core)
    testImplementation(mockk)
}
