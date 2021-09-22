val junitJupiterVersion: String by project
val ktorversion: String by project
val rapidsandriversversion: String by project
val kotestVersion: String by project

plugins {
    application
    kotlin("jvm")
}

dependencies {
    implementation(kotlin("stdlib"))
    implementation("com.github.navikt:rapids-and-rivers:$rapidsandriversversion")
    implementation("io.ktor:ktor-client-okhttp:$ktorversion")
    implementation("io.ktor:ktor-client-core:$ktorversion")
    implementation("io.ktor:ktor-client-logging-jvm:$ktorversion")
    implementation("io.ktor:ktor-client-auth:$ktorversion")
    implementation("io.ktor:ktor-client-jackson:$ktorversion")
    implementation(project(":libs:ktorclient-auth-clientcredentials"))
    implementation ("com.nfeld.jsonpathkt:jsonpathkt:2.0.0")
    testImplementation("io.ktor:ktor-client-mock:$ktorversion")
    testImplementation("org.junit.jupiter:junit-jupiter-api:$junitJupiterVersion")
    //testImplementation("org.junit.jupiter:junit-jupiter-params:$junitJupiterVersion")
    testRuntimeOnly("org.junit.jupiter:junit-jupiter-engine:$junitJupiterVersion")
    testImplementation("io.kotest:kotest-assertions-core:$kotestVersion")

    // Logging
    implementation("org.slf4j:slf4j-api:1.7.30")
    implementation("ch.qos.logback:logback-classic:1.2.3")
    implementation("net.logstash.logback:logstash-logback-encoder:6.6")

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


