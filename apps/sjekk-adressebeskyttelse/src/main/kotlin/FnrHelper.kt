package no.nav.etterlatte

import com.fasterxml.jackson.databind.JsonNode
import no.nav.etterlatte.libs.common.person.Foedselsnummer

internal class FnrHelper {
    companion object {
        /**
         * @return: Liste over gyldige fnr funnet i [JsonNode]
         */
        fun finnAlleFnr(jsonNode: JsonNode): List<String> {
            val regex = """\b(\d{11})\b""".toRegex()

            return regex.findAll(jsonNode.toString())
                .filter { Foedselsnummer.isValid(it.value) }
                .map { it.groupValues[1] }
                .toList()
                .distinct()
        }
    }
}
