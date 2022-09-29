plugins {
    id("etterlatte.rapids-and-rivers")
}

dependencies {
    implementation(Etterlatte.Common)

    implementation(Database.HikariCp)
    implementation(Database.FlywayCore)
    implementation(Database.Postgresql)
    implementation(NavFelles.TokenValidationKtor)

    implementation(Ktor.ServerAuth)
    implementation(Ktor.ServerContentNegotiation)
    implementation(Ktor.Jackson)
    implementation(Ktor.ClientCore)
    implementation(Ktor.CallLogging)
    implementation(Ktor.ClientContentNegotiation)
    implementation(Ktor.ClientCioJvm)

    testImplementation(Etterlatte.CommonTest)
    testImplementation(TestContainers.JunitJupiter)
    testImplementation(TestContainers.Postgresql)

    testImplementation(Ktor.ServerTests)
    testImplementation(Kotest.AssertionsCore)
    testImplementation(MockK.MockK)
}
