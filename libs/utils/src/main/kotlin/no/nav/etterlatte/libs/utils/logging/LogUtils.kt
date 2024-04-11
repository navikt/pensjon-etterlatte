package no.nav.etterlatte.libs.utils.logging

import org.slf4j.MDC
import java.util.*

const val X_CORRELATION_ID: String = "x_correlation_id"
const val CORRELATION_ID: String = "correlation_id"

fun getCorrelationId(): String = MDC.get(CORRELATION_ID) ?: generateCorrelationId()

private fun generateCorrelationId() = UUID.randomUUID().toString()
