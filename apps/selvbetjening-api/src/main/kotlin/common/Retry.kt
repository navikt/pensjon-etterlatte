package no.nav.etterlatte.common


suspend fun<T>unsafeRetry(times: Int = 2, block: suspend () -> T) = retry(times, block).let {
    it.first?:throw it.second.last()
}

suspend fun<T>retry(times: Int = 2, block: suspend () -> T) = retryInner(times, emptyList(), block)


private suspend fun<T>retryInner(times: Int, exceptions: List<Exception>, block: suspend () -> T): Pair<T?, List<Exception>>{
    return try{
        block() to exceptions
    }catch (ex: Exception){
        if (times<1) null to exceptions + ex
        else retryInner(times - 1, exceptions + ex,  block)
    }
}