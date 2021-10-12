package no.nav.etterlatte.common

class RetryResult(
    val response: Any? = null,
    val exceptions: List<Exception> = emptyList()
) {
    fun lastError() = exceptions.lastOrNull()
}

suspend fun <T> unsafeRetry(times: Int = 2, block: suspend () -> T) = retry(times, block).let {
    it.response ?: throw it.exceptions.last()
}

suspend fun <T> retry(times: Int = 2, block: suspend () -> T) = retryInner(times, emptyList(), block)

private suspend fun <T> retryInner(times: Int, exceptions: List<Exception>, block: suspend () -> T): RetryResult {
    return try {
        RetryResult(block(), exceptions)
    } catch (ex: Exception) {
        if (times < 1) RetryResult(null, exceptions + ex)
        else retryInner(times - 1, exceptions + ex, block)
    }
}
