plugins {
    kotlin("jvm") version "1.4.20" apply false
}


allprojects {
    group = "no.nav.etterlatte"
    version = "unspecified"

    repositories {
        mavenCentral()
        maven("https://jitpack.io")
        maven("https://kotlin.bintray.com/ktor")
    }

    tasks.withType<Test> {
        useJUnitPlatform()
        testLogging {
            events("passed", "skipped", "failed")
        }
    }

}

subprojects {
    ext {
        set("ktorversion", "1.5.1")
        set("kotlinversion", "1.4.20")
        set("junitJupiterVersion", "5.6.2")
        set("tokensupportversion", "1.3.3")
        set("rapidsandriversversion", "1.6535123")
        set("logbackversion", "1.2.1")
        set("micrometerversion", "1.5.5")
        set("orgJsonVersion", "20180813")
        set("jacksonVersion", "2.12.1")
    }

    tasks.withType<org.jetbrains.kotlin.gradle.tasks.KotlinCompile> {
        kotlinOptions.jvmTarget = "14"
    }

}


tasks.withType<Wrapper> {
    gradleVersion = "6.7"
}