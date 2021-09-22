plugins {
    kotlin("jvm") version "1.5.30" apply false
    id("ca.cutterslade.analyze") version "1.8.1" apply true
}

allprojects {
    group = "no.nav.etterlatte"
    version = "unspecified"
    repositories {
        mavenCentral()
        maven("https://kotlin.bintray.com/ktor")
        maven("https://packages.confluent.io/maven/")
        maven("https://jitpack.io")
    }
    apply(plugin = "kotlin")
    apply(plugin = "ca.cutterslade.analyze")

    tasks.withType<ca.cutterslade.gradle.analyze.AnalyzeDependenciesTask> {
        warnUsedUndeclared = true
        warnUnusedDeclared = true
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
        set("ktorversion", "1.6.1")
        set("kotlinversion", "1.5.21")
        set("junitJupiterVersion", "5.7.2")
        set("tokensupportversion", "1.3.3")
        set("rapidsandriversversion", "1.6535123")
        set("logbackversion", "1.2.1")
        set("micrometerversion", "1.5.5")
        set("orgJsonVersion", "20180813")
        set("jacksonVersion", "2.12.1")
        set("kotestVersion", "4.6.3")
    }

    tasks.withType<org.jetbrains.kotlin.gradle.tasks.KotlinCompile> {
        kotlinOptions.jvmTarget = "16"
    }
}

tasks.withType<Wrapper> {
    gradleVersion = "7.2"
}