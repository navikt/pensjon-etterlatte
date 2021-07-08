package no.nav.etterlatte.common

import no.nav.etterlatte.ktortokenexchange.ThreadBoundSecCtx

fun innloggetBrukerFnr(): String = ThreadBoundSecCtx.get().user()!!
