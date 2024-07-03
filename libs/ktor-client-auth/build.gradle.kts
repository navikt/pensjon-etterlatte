plugins {
    kotlin("jvm")
    id("etterlatte.libs")
}

dependencies {
    api(libs.ktor.okhttp)
    api(libs.ktor.client.auth)
    api(libs.ktor.client.content.negotiation)
    api(libs.ktor.serialization.jackson)
    api(libs.ktor.client.logging)

    api(libs.navfelles.token.client.core)
}