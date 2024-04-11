plugins {
    id("etterlatte.rapids-and-rivers")
}

dependencies {
    implementation(libs.ktor.okhttp)
    implementation(libs.ktor.client.core)
    implementation(libs.ktor.client.auth)
    implementation(libs.ktor.serialization.jackson)

    implementation(libs.etterlatte.common)
    implementation(project(":libs:utils"))
    implementation(project(":libs:pdl"))
    implementation(project(":libs:ktor-client-auth"))

    testImplementation(libs.ktor.client.mock)
    testImplementation(libs.mockk)
    testImplementation(libs.kotlinx.coroutines.core)
    testImplementation(libs.kotest.assertions.core)

    testImplementation(project(":libs:common-test"))
}
