plugins {
    id("etterlatte.common")
}

dependencies {
    implementation(libs.etterlatte.common)
    implementation(project(":libs:utils"))
    implementation(project(":libs:etterlatte-funksjonsbrytere"))

    implementation(libs.database.hikari.cp)
    implementation(libs.database.flyway.core)
    implementation(libs.database.flyway.postgres)
    implementation(libs.database.postgresql)
    implementation(libs.navfelles.token.validation.ktor)

    implementation(libs.ktor.okhttp)
    implementation(libs.ktor.server.cio)
    implementation(libs.ktor.client.auth)
    implementation(libs.navfelles.token.client.core)
    implementation(libs.ktor.client.content.negotiation)

    implementation(libs.ktor.serialization.jackson)
    implementation(libs.ktor.client.cio.jvm)
    implementation(libs.navfelles.rapids.and.rivers)

    testImplementation(testFixtures(project(":libs:utils")))
    testImplementation(libs.testcontainers.junit.jupiter)
    testImplementation(libs.testcontainers.postgresql)

    testImplementation(libs.ktor.server.tests)
    testImplementation(libs.kotest.assertions.core)
    testImplementation(libs.mockk)
}