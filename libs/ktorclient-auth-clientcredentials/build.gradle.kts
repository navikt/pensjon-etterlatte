
val junitJupiterVersion: String by project
val ktorversion: String by project
val tokensupportversion:String by project

plugins {
    kotlin("jvm")
}

dependencies {
    api(kotlin("stdlib"))
    api(kotlin("reflect"))

    ktor("client-okhttp")
    ktor("client-core")
    ktor("client-logging-jvm")
    ktor("client-auth")
    ktor("client-jackson")
    api("no.nav.security:token-client-core:$tokensupportversion")

}

fun DependencyHandler.ktor(module: String){
    when(module){
        "client-jackson" -> api("io.ktor:ktor-$module:$ktorversion")
        else ->  api("io.ktor:ktor-$module:$ktorversion"){
            exclude("org.jetbrains.kotlin:kotlin-reflect")
        }
    }
}