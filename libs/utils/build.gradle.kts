plugins {
    kotlin("jvm")
    id("java-library")
    id("java-test-fixtures")
}

repositories {
    mavenCentral()
    maven {
        url = uri("https://maven.pkg.github.com/navikt/pensjon-etterlatte-libs")
        credentials {
            username = "token"
            password = System.getenv("GITHUB_TOKEN")
        }
    }
}

dependencies {
    api(kotlin("stdlib"))
    api(kotlin("reflect"))

    implementation(libs.etterlatte.common)

    implementation(libs.ktor.serialization.jackson)

    testImplementation(libs.jupiter.api)
    testImplementation(libs.mockk)
}

tasks {
    withType<Test> {
        useJUnitPlatform()
    }
}
