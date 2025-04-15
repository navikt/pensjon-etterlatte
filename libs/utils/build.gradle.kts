plugins {
    kotlin("jvm")
    id("java-library")
    id("java-test-fixtures")
}

dependencies {
    implementation(libs.etterlatte.common)

    implementation(libs.ktor.client.core)

    testImplementation(libs.jupiter.api)
    testRuntimeOnly(libs.jupiter.engine)
    testFixturesRuntimeOnly(libs.junit.platform.launcher)
    testImplementation(libs.kotest.assertions.core)
    testImplementation(libs.mockk)
    testFixturesImplementation(libs.etterlatte.common)
}