
val junitJupiterVersion:String by project
val ktorversion:String by project
val rapidsandriversversion:String by project

plugins {
    kotlin("jvm")
    id("com.github.johnrengelman.shadow") version "5.2.0"
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

    testImplementation("io.ktor:ktor-client-mock:$ktorversion")
    testImplementation("org.junit.jupiter:junit-jupiter-api:$junitJupiterVersion")
    testImplementation("org.junit.jupiter:junit-jupiter-params:$junitJupiterVersion")
    testRuntimeOnly("org.junit.jupiter:junit-jupiter-engine:$junitJupiterVersion")

}
tasks.named<Jar>("jar") {
    archiveBaseName.set("app")
    manifest {
        attributes["Main-Class"] = "FinnetterlatteKt"
    }
}

tasks.withType<Test> {
    useJUnitPlatform()
    testLogging {
        events("passed", "skipped", "failed")
    }
}
