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

    testImplementation(libs.jupiter.api)
    testImplementation(libs.jupiter.params)
    testRuntimeOnly(libs.jupiter.engine)
    testImplementation(libs.kotest.assertions.core)
}

tasks {
    withType<Test> {
        useJUnitPlatform()
    }
}
