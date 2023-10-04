import org.gradle.api.tasks.testing.logging.TestLogEvent

plugins {
    kotlin("jvm")
    application
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
    implementation(kotlin("stdlib"))

    // Logging
    implementation(logging.slf4j.api)
    implementation(logging.logback.classic)
    implementation(logging.logstash.logback.encoder)

    // JUnit Testing
    testImplementation(jupiter.api)
    testImplementation(jupiter.params)
    testRuntimeOnly(jupiter.engine)
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

        doLast {
            configurations.runtimeClasspath.get().forEach {
                val file = File("$buildDir/libs/${it.name}")
                if (!file.exists())
                    it.copyTo(file)
            }
        }
    }

    tasks.withType<Test> {
        useJUnitPlatform()
        testLogging {
            events(TestLogEvent.PASSED, TestLogEvent.SKIPPED, TestLogEvent.FAILED)
        }
    }
}
