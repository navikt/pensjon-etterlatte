plugins {
    id("etterlatte.common")
}

dependencies {
    implementation(etterlatte.common)
    implementation(etterlatte.ktor.client.auth)

    implementation(ktor.okhttp)
    implementation(ktor.server.core)
    implementation(ktor.server.cio)
    implementation(ktor.server.call.logging)
    implementation(ktor.client.core)
    implementation(ktor.client.auth)
    implementation(ktor.server.metrics.micrometer)
    implementation(ktor.serialization.jackson)
    implementation(ktor.server.auth)
    implementation(ktor.client.content.negotiation)
    implementation(ktor.server.content.negotiation)

    implementation(micrometer.prometheus)

    implementation(jackson.datatypejsr310)
    implementation(jackson.datatypejdk8)
    implementation(jackson.module.kotlin)

    implementation(navfelles.token.client.core)
    implementation(navfelles.token.validation.ktor)

    testImplementation(mockk)
    testImplementation(kotest.assertions.core)
    testImplementation(ktor.client.mock)
    testImplementation(ktor.server.tests)
    testImplementation(kotlinx.coroutines.core)
    testImplementation(navfelles.mock.oauth2.server)
    testImplementation(etterlatte.common.test)
}
