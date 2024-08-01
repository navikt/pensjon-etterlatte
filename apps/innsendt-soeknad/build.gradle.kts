plugins {
    id("etterlatte.common")
}

dependencies {
    implementation(libs.etterlatte.common)
    implementation(project(":libs:utils"))

    implementation(libs.database.hikari.cp)
    implementation(libs.database.flyway.core)
    implementation(libs.database.flyway.postgres)
    implementation(libs.database.postgresql)
    implementation(libs.navfelles.token.validation.ktor)

    implementation(libs.ktor.serialization.jackson)
    implementation(libs.ktor.client.cio.jvm)
    implementation(libs.navfelles.rapids.and.rivers)

    testImplementation(project(":libs:common-test"))
    testImplementation(libs.testcontainers.junit.jupiter)
    testImplementation(libs.testcontainers.postgresql)

    testImplementation(libs.ktor.server.tests)
    testImplementation(libs.kotest.assertions.core)
    testImplementation(libs.mockk)
}
