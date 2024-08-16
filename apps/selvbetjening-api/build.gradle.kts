plugins {
    id("etterlatte.common")
}

dependencies {
    implementation(libs.etterlatte.common)
    implementation(project(":libs:utils"))

    implementation(libs.ktor.okhttp)
    implementation(libs.ktor.server.cio)
    implementation(libs.ktor.client.auth)
    implementation(libs.ktor.server.metrics.micrometer)
    implementation(libs.ktor.serialization.jackson)
    implementation(libs.ktor.client.content.negotiation)

    implementation(libs.micrometer.prometheus)

    implementation(libs.navfelles.token.client.core)
    implementation(libs.navfelles.token.validation.ktor)

    testImplementation(libs.mockk)
    testImplementation(libs.kotest.assertions.core)
    testImplementation(libs.ktor.client.mock)
    testImplementation(libs.ktor.server.tests)
    testImplementation(libs.navfelles.mock.oauth2.server)
    testImplementation(testFixtures(project(":libs:utils")))
}
