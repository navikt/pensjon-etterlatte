import com.github.jk1.license.render.InventoryReportRenderer
import com.github.jk1.license.render.JsonReportRenderer
import org.gradle.api.tasks.testing.logging.TestLogEvent

plugins {
    alias(libs.plugins.license) apply true
}

licenseReport {
    renderers = arrayOf(JsonReportRenderer(), InventoryReportRenderer())
    allowedLicensesFile = File("$projectDir/buildSrc/akseptable-lisenser.json")
}

subprojects.forEach { sub ->
    sub.repositories {
        mavenCentral()
        maven {
            url = uri("https://github-package-registry-mirror.gc.nav.no/cached/maven-release")
        }
    }
    sub.tasks {
        withType<Test> {
            useJUnitPlatform()
            testLogging {
                events(TestLogEvent.PASSED, TestLogEvent.SKIPPED, TestLogEvent.FAILED)
                exceptionFormat = org.gradle.api.tasks.testing.logging.TestExceptionFormat.FULL
            }
        }
    }
}
