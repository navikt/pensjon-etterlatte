plugins {
    id("etterlatte.common")
}

dependencies {
    implementation(libs.etterlatte.common)
    implementation(project(":libs:utils"))
    implementation(project(":libs:ktor-client-auth"))

    implementation(libs.ktor.server.cio)
    implementation(libs.ktor.server.metrics.micrometer)

    implementation(libs.micrometer.prometheus)

    implementation(libs.navfelles.token.validation.ktor)

    testImplementation(libs.mockk)
    testImplementation(libs.kotest.assertions.core)
    testImplementation(libs.ktor.client.mock)
    testImplementation(libs.ktor.server.tests)
    testImplementation(libs.kotlinx.coroutines.core)
    testImplementation(libs.navfelles.mock.oauth2.server)
    testImplementation(testFixtures(project(":libs:utils")))
}
