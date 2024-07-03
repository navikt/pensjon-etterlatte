plugins {
    kotlin("jvm")
    id("etterlatte.libs")
}

dependencies {
    implementation(libs.etterlatte.common)

    implementation(libs.ktor.serialization.jackson)
    implementation(libs.ktor.client.content.negotiation)

    testImplementation(libs.jupiter.api)
    testRuntimeOnly(libs.jupiter.engine)
    testImplementation(libs.kotest.assertions.core)
    testImplementation(libs.mockk)
    testImplementation(libs.ktor.client.mock)
}