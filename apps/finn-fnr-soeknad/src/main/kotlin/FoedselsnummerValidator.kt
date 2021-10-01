package no.nav.etterlatte

class FoedselsnummerValidator {
    companion object {
        private val controlDigits1 = intArrayOf(3, 7, 6, 1, 8, 9, 4, 5, 2)
        private val controlDigits2 = intArrayOf(5, 4, 3, 2, 7, 6, 5, 4, 3, 2)

        fun isValid(value: String): Boolean {
            return !Regex("[0]{11}").matches(value)
                    && value.length == 11
                    && value.toBigIntegerOrNull() != null
                    && validateControlDigits(value)
        }

        private fun validateControlDigits(value: String): Boolean {
            val ks1 = Character.getNumericValue(value[9])

            val c1 = mod(controlDigits1, value)
            if (c1 == 10 || c1 != ks1) {
                return false
            }

            val c2 = mod(controlDigits2, value)
            if (c2 == 10 || c2 != Character.getNumericValue(value[10])) {
                return false
            }

            return true
        }

        private fun mod(arr: IntArray, value: String): Int {
            val sum = arr.withIndex()
                .sumOf { (i, m) -> m * Character.getNumericValue(value[i]) }

            val result = 11 - (sum % 11)
            return if (result == 11) 0 else result
        }
    }
}
