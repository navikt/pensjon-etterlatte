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
    implementation(libs.etterlatte.common)

    implementation(libs.ktor.serialization.jackson)
    implementation(libs.ktor.client.content.negotiation)

    testImplementation(libs.jupiter.api)
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
