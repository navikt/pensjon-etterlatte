plugins {
    kotlin("jvm")
    id("etterlatte.libs")
}

dependencies {
    implementation(libs.etterlatte.common)

    implementation(libs.ktor.client.core)

    testImplementation(libs.jupiter.api)
    testRuntimeOnly(libs.jupiter.engine)
    testImplementation(libs.kotest.assertions.core)
    testImplementation(libs.mockk)
}

tasks {
    withType<Test> {
        useJUnitPlatform()
    }
}
