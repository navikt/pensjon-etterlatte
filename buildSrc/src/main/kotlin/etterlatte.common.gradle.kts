import org.gradle.accessors.dm.LibrariesForLibs

val libs = the<LibrariesForLibs>()

plugins {
    kotlin("jvm")
    id("etterlatte.libs")
    application
}

dependencies {
    // Logging
    implementation(libs.logging.slf4j.api)
    implementation(libs.logging.logback.classic)
    implementation(libs.logging.logstash.logback.encoder)

    // JUnit Testing
    testImplementation(libs.jupiter.params)
}

tasks {
    named<Jar>("jar") {
        archiveBaseName.set("app")

        manifest {
            attributes["Main-Class"] = "no.nav.etterlatte.ApplicationKt"
            attributes["Class-Path"] = configurations.runtimeClasspath.get().joinToString(separator = " ") {
                it.name
            }
        }

        val configuration =
            configurations.runtimeClasspath.get().map {
                it.toPath().toFile()
            }
        val buildDirectory = layout.buildDirectory
        doLast {
            configuration.forEach {
                val file =
                    buildDirectory
                        .file("libs/${it.name}")
                        .get()
                        .asFile
                if (!file.exists()) {
                    it.copyTo(file)
                }
            }
        }
    }
}
