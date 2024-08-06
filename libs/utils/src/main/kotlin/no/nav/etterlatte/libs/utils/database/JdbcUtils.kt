package no.nav.etterlatte.libs.utils.database

import java.sql.ResultSet

fun <T> ResultSet.singleOrNull(block: ResultSet.() -> T): T? =
	if (next()) {
		block().also {
			require(!next()) { "Skal være unik" }
		}
	} else {
		null
	}