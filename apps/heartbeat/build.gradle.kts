val junitJupiterVersion: String by project
val ktorversion: String by project
val rapidsandriversversion: String by project
val kotlinversion: String by project

plugins {
    application
    kotlin("jvm")
}

dependencies {
    implementation(kotlin("stdlib"))
    implementation(kotlin("reflect"))
    implementation("com.github.navikt:rapids-and-rivers:$rapidsandriversversion")
    implementation("org.jetbrains.kotlin:kotlin-stdlib-jdk8:$kotlinversion")
}
tasks.named<Jar>("jar") {
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


