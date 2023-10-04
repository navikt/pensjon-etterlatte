plugins {
    id("etterlatte.rapids-and-rivers")
}

dependencies {
    implementation(ktor.okhttp)
    implementation(ktor.client.core)
    implementation(ktor.client.auth)
    implementation(ktor.client.content.negotiation)
    implementation(ktor.serialization.jackson)

    implementation(etterlatte.common)
    implementation(etterlatte.ktor.client.auth)

    testImplementation(mockk)
    testImplementation(ktor.client.mock)
    testImplementation(kotlinx.coroutines.core)
}
