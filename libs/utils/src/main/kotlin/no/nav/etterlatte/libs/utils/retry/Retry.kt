package libs.common.util

import libs.common.util.RetryResult.Failure
import libs.common.util.RetryResult.Success

sealed class RetryResult {
    data class Success(
        val content: Any? = null,
        val previousExceptions: List<Exception> = emptyList(),
    ) : RetryResult()

    data class Failure(
        val exceptions: List<Exception> = emptyList(),
    ) : RetryResult() {
        fun samlaExceptions(): Exception = samleExceptions(this.exceptions)
    }
}

suspend fun <T> unsafeRetry(
    times: Int = 2,
    block: suspend () -> T,
) = retryInner(times, emptyList(), block).let {
    when (it) {
        is Success -> it.content
        is Failure -> throw it.samlaExceptions()
    }
}

private suspend fun <T> retryInner(
    times: Int,
    exceptions: List<Exception>,
    block: suspend () -> T,
): RetryResult =
    try {
        Success(block(), exceptions)
    } catch (ex: Exception) {
        if (times < 1) {
            Failure(exceptions + ex)
        } else {
            retryInner(times - 1, exceptions + ex, block)
        }
    }

internal fun samleExceptions(exceptions: List<Exception>): Exception {
    val siste = exceptions.last()
    exceptions.dropLast(1).reversed().forEach { siste.addSuppressed(it) }
    return siste
}