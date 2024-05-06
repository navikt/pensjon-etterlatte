import com.github.jk1.license.render.InventoryReportRenderer
import com.github.jk1.license.render.JsonReportRenderer

plugins {
    alias(libs.plugins.license) apply true
}

licenseReport {
    renderers = arrayOf(JsonReportRenderer(), InventoryReportRenderer())
    allowedLicensesFile = File("$projectDir/buildSrc/akseptable-lisenser.json")
}