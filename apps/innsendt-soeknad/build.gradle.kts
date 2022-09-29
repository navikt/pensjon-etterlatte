plugins {
    id("etterlatte.rapids-and-rivers")
}

dependencies {
    implementation(Etterlatte.Common)

    implementation("com.zaxxer:HikariCP:3.4.5")
    implementation("org.flywaydb:flyway-core:6.5.0")
    implementation("org.postgresql:postgresql:42.2.5")
    implementation(NavFelles.TokenValidationKtor)

    implementation(Ktor.ServerAuth)
    implementation(Ktor.ServerContentNegotiation)
    implementation(Ktor.Jackson)
    implementation(Ktor.ClientCore)
    implementation(Ktor.CallLogging)
    implementation(Ktor.ClientContentNegotiation)
    implementation(Ktor.ClientCioJvm)

    testImplementation(Etterlatte.CommonTest)
    testImplementation("com.h2database:h2:1.4.200")
    testImplementation("org.testcontainers:junit-jupiter:1.15.3")
    testImplementation("org.testcontainers:postgresql:1.16.0")

    testImplementation(Ktor.ServerTests)
    testImplementation(Kotest.AssertionsCore)
    testImplementation(MockK.MockK)
}
