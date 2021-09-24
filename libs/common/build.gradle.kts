
val junitJupiterVersion: String by project
val ktorversion: String by project
val tokensupportversion:String by project
val jacksonVersion: String by project

plugins {
    kotlin("jvm")
}

dependencies {
    api(kotlin("stdlib"))
    api(kotlin("reflect"))
    api("com.fasterxml.jackson.datatype:jackson-datatype-jsr310:$jacksonVersion")
    api("com.fasterxml.jackson.datatype:jackson-datatype-jdk8:$jacksonVersion")
    api("com.fasterxml.jackson.module:jackson-module-kotlin:$jacksonVersion")

    testImplementation("org.junit.jupiter:junit-jupiter-api:$junitJupiterVersion")
    testImplementation("org.junit.jupiter:junit-jupiter-params:$junitJupiterVersion")
    testRuntimeOnly("org.junit.jupiter:junit-jupiter-engine:$junitJupiterVersion")
}

fun DependencyHandler.ktor(module: String){
    when(module){
        "client-jackson" -> api("io.ktor:ktor-$module:$ktorversion")
        else ->  api("io.ktor:ktor-$module:$ktorversion"){
            exclude("org.jetbrains.kotlin:kotlin-reflect")
        }
    }
}

tasks.withType<Test> {
    useJUnitPlatform()
}
