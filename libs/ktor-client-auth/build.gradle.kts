plugins {
    kotlin("jvm")
}

repositories {
    mavenCentral()
}

dependencies {
    api(kotlin("stdlib"))
    api(kotlin("reflect"))

    api(libs.ktor.okhttp)
    api(libs.ktor.client.core)
    api(libs.ktor.client.auth)
    api(libs.ktor.client.content.negotiation)
    api(libs.ktor.serialization.jackson)
    api(libs.ktor.client.logging)

    api(libs.navfelles.token.client.core)
}

tasks {
    withType<Test> {
        useJUnitPlatform()
    }
}
