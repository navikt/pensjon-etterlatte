plugins {
    id("etterlatte.rapids-and-rivers")
}

dependencies {
    implementation(libs.ktor.okhttp)
    implementation(libs.ktor.client.core)
    implementation(libs.ktor.client.auth)
    implementation(libs.ktor.client.content.negotiation)
    implementation(libs.ktor.serialization.jackson)

    implementation(libs.etterlatte.common)
    implementation(libs.etterlatte.ktor.client.auth)

    testImplementation(libs.mockk)
    testImplementation(libs.ktor.client.mock)
    testImplementation(libs.kotlinx.coroutines.core)
}
