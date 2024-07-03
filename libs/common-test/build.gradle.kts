plugins {
    kotlin("jvm")
    id("etterlatte.libs")
}

dependencies {
    implementation(libs.etterlatte.common)

    testImplementation(libs.jupiter.api)
    testRuntimeOnly(libs.jupiter.engine)
    testImplementation(libs.kotest.assertions.core)
}

tasks {
    withType<Test> {
        useJUnitPlatform()
    }
}
