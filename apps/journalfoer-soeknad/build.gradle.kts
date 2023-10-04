plugins {
    id("etterlatte.rapids-and-rivers")
}

dependencies {
    implementation(ktor.okhttp)
    implementation(ktor.client.core)
    implementation(ktor.client.auth)
    implementation(ktor.serialization.jackson)

    implementation(etterlatte.common)
    implementation(etterlatte.ktor.client.auth)

    testImplementation(ktor.client.mock)
    testImplementation(mockk)
    testImplementation(kotlinx.coroutines.core)
    testImplementation(kotest.assertions.core)

    testImplementation(etterlatte.common.test)
}
