plugins {
    kotlin("jvm")
    id("etterlatte.libs")
    id("java-library")
    id("java-test-fixtures")
}

dependencies {
    implementation(libs.etterlatte.common)

    implementation(libs.ktor.client.core)

    testImplementation(libs.jupiter.api)
    testRuntimeOnly(libs.jupiter.engine)
    testImplementation(libs.kotest.assertions.core)
    testImplementation(libs.mockk)
}