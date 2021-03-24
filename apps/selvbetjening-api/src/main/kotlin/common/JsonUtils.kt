package no.nav.etterlatte.common

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper

fun Any.toJson(): String = jacksonObjectMapper().writeValueAsString(this)
