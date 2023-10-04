plugins {
    id("etterlatte.rapids-and-rivers")
}

dependencies {
    implementation(libs.etterlatte.common)

    implementation(libs.database.hikari.cp)
    implementation(libs.database.flyway.core)
    implementation(libs.database.postgresql)
    implementation(libs.navfelles.token.validation.ktor)

    implementation(libs.ktor.server.auth)
    implementation(libs.ktor.server.content.negotiation)
    implementation(libs.ktor.serialization.jackson)
    implementation(libs.ktor.client.core)
    implementation(libs.ktor.server.call.logging)
    implementation(libs.ktor.client.content.negotiation)
    implementation(libs.ktor.client.cio.jvm)

    testImplementation(libs.etterlatte.common.test)
    testImplementation(libs.testcontainers.junit.jupiter)
    testImplementation(libs.testcontainers.postgresql)

    testImplementation(libs.ktor.server.tests)
    testImplementation(libs.kotest.assertions.core)
    testImplementation(libs.mockk)
}
