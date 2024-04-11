plugins {
    kotlin("jvm")
}

repositories {
    mavenCentral()
    maven {
        url = uri("https://maven.pkg.github.com/navikt/pensjon-etterlatte-libs")
        credentials {
            username = "token"
            password = System.getenv("GITHUB_TOKEN")
        }
    }
}

dependencies {
    api(kotlin("stdlib"))
    api(kotlin("reflect"))

    api(libs.jackson.datatypejsr310)
    api(libs.jackson.datatypejdk8)
    api(libs.jackson.module.kotlin)

    implementation(libs.etterlatte.common)

    implementation(libs.ktor.client.core)
    implementation(libs.ktor.client.logging)
    implementation(libs.ktor.client.auth)
    implementation(libs.ktor.serialization.jackson)
    implementation(libs.ktor.client.content.negotiation)

    testImplementation(libs.jupiter.api)
    testImplementation(libs.jupiter.params)
    testRuntimeOnly(libs.jupiter.engine)
    testImplementation(libs.kotest.assertions.core)
    testImplementation(libs.mockk)
    testImplementation(libs.ktor.client.mock)
}

tasks {
    withType<Test> {
        useJUnitPlatform()
    }
}
