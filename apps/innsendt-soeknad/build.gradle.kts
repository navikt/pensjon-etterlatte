plugins {
    id("etterlatte.rapids-and-rivers")
}

dependencies {
    implementation("com.zaxxer:HikariCP:3.4.5")
    implementation("com.github.seratch:kotliquery:1.3.1")
    implementation("org.flywaydb:flyway-core:6.5.0")
    implementation("org.postgresql:postgresql:42.2.5")
    implementation("no.nav.security:token-validation-ktor:1.3.3")

    implementation(Ktor.Auth)
    implementation(Ktor.Jackson)
    implementation(Ktor.ClientCore)
    implementation(Ktor.ClientJackson)
    implementation(Ktor.ClientCioJvm)

    testImplementation("com.h2database:h2:1.4.200")
    testImplementation("org.testcontainers:junit-jupiter:1.15.3")
    testImplementation("org.testcontainers:postgresql:1.15.3")

    testImplementation(Ktor.ServerTests)
    testImplementation(Kotest.AssertionsCore)
    testImplementation(MockK.MockK)
}
