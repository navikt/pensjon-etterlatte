plugins {
    id("etterlatte.common")
}

dependencies {
    implementation(libs.etterlatte.common)
    implementation(project(":libs:utils"))
    implementation(project(":libs:pdl"))
    implementation(project(":libs:ktor-client-auth"))

    implementation(libs.ktor.okhttp)
    implementation(libs.ktor.server.core)
    implementation(libs.ktor.server.cio)
    implementation(libs.ktor.server.call.logging)
    implementation(libs.ktor.client.core)
    implementation(libs.ktor.client.auth)
    implementation(libs.ktor.server.metrics.micrometer)
    implementation(libs.ktor.serialization.jackson)
    implementation(libs.ktor.server.auth)
    implementation(libs.ktor.client.content.negotiation)
    implementation(libs.ktor.server.content.negotiation)

    implementation(libs.micrometer.prometheus)

    implementation(libs.jackson.datatypejsr310)
    implementation(libs.jackson.datatypejdk8)
    implementation(libs.jackson.module.kotlin)

    implementation(libs.navfelles.token.client.core)
    implementation(libs.navfelles.token.validation.ktor)

    testImplementation(libs.mockk)
    testImplementation(libs.kotest.assertions.core)
    testImplementation(libs.ktor.client.mock)
    testImplementation(libs.ktor.server.tests)
    testImplementation(libs.kotlinx.coroutines.core)
    testImplementation(libs.navfelles.mock.oauth2.server)
    testImplementation(project(":libs:common-test"))
}
