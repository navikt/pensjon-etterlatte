import { ErrorSummary, Heading, VStack } from '@navikt/ds-react'
import { ReactNode, useEffect, useRef, useState } from 'react'
import { DefaultValues, FieldErrors, FieldValues, FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate, useOutletContext } from 'react-router'
import { lagreKladd } from '../../api/api'
import { useSoknadContext } from '../../context/soknad/SoknadContext'
import { ActionTypes, ISoeknad } from '../../context/soknad/soknad'
import { StegPath, stegUrl } from '../../typer/steg'
import Navigasjon from '../felles/Navigasjon'

export interface SoeknadStegContext {
    path: StegPath
    tittel: string
    neste?: StegPath
    forrige?: StegPath | '/'
}

export const finnFeil = (errors: FieldErrors): { id: string; melding: string }[] => {
    const feil: { id: string; melding: string }[] = []
    const les = (verdi: unknown, path: string) => {
        if (!verdi || typeof verdi !== 'object') return
        if ('message' in verdi && typeof verdi.message === 'string') {
            feil.push({ id: path, melding: verdi.message })
            return
        }
        for (const [key, value] of Object.entries(verdi)) {
            if (key !== 'ref') les(value, path ? `${path}.${key}` : key)
        }
    }
    les(errors, '')
    return feil
}

interface Props<T extends FieldValues> {
    tittel: string
    defaultValues: DefaultValues<T>
    oppdaterSoeknad: (state: ISoeknad, data: T) => ISoeknad
    neste?: StegPath
    forrige?: StegPath | '/'
    shouldUnregister?: boolean
    children: ReactNode
}

export const SoeknadSteg = <T extends FieldValues>({
    tittel,
    defaultValues,
    oppdaterSoeknad,
    neste,
    forrige,
    shouldUnregister = true,
    children,
}: Props<T>) => {
    const { state, dispatch } = useSoknadContext()
    const { t } = useTranslation()
    const navigate = useNavigate()
    const methods = useForm<T>({ defaultValues, shouldUnregister, shouldFocusError: false })
    const [lagrer, settLagrer] = useState(false)
    const [lagringsfeil, settLagringsfeil] = useState(false)
    const [feilforsok, settFeilforsok] = useState(0)
    const errorRef = useRef<HTMLDivElement>(null)
    const headingRef = useRef<HTMLHeadingElement>(null)
    const opptatt = useRef(false)
    const feil = finnFeil(methods.formState.errors)

    useEffect(() => {
        headingRef.current?.focus()
    }, [])

    useEffect(() => {
        if (feilforsok > 0 || lagringsfeil) errorRef.current?.focus()
    }, [feilforsok, lagringsfeil])

    const lagre = async (data: T, maal?: StegPath | '/') => {
        if (opptatt.current) return false
        opptatt.current = true
        settLagrer(true)
        settLagringsfeil(false)
        const soeknad = oppdaterSoeknad(state, structuredClone(data))
        dispatch({ type: ActionTypes.OPPDATER_KLADD, payload: soeknad })
        try {
            const kladd = await lagreKladd({
                ...soeknad,
                aktivtSteg: maal && maal !== '/' ? maal : soeknad.aktivtSteg,
            })
            dispatch({ type: ActionTypes.OPPDATER_KLADD, payload: kladd })
            if (maal) navigate(maal === '/' ? '/' : stegUrl(maal))
            return true
        } catch {
            settLagringsfeil(true)
            settFeilforsok((antall) => antall + 1)
            return false
        } finally {
            opptatt.current = false
            settLagrer(false)
        }
    }

    const nesteSteg = methods.handleSubmit(
        (data) => lagre(data, neste),
        () => settFeilforsok((antall) => antall + 1)
    )

    return (
        <FormProvider {...methods}>
            <form
                onSubmit={(event) => {
                    event.preventDefault()
                    if (neste) void nesteSteg()
                }}
                noValidate
            >
                <VStack gap="space-32">
                    {(feil.length > 0 || lagringsfeil) && (
                        <ErrorSummary ref={errorRef} heading={t('skjema.feil')}>
                            {feil.map(({ id, melding }) => (
                                <ErrorSummary.Item key={id} href={`#${id}`}>
                                    {melding}
                                </ErrorSummary.Item>
                            ))}
                            {lagringsfeil && (
                                <ErrorSummary.Item href={neste ? '#navigasjon-neste' : '#avbryt-btn'}>
                                    {t('skjema.lagringFeilet')}
                                </ErrorSummary.Item>
                            )}
                        </ErrorSummary>
                    )}
                    <Heading ref={headingRef} size="large" align="center" level="2" tabIndex={-1}>
                        {tittel}
                    </Heading>
                    {children}
                    <Navigasjon
                        neste={neste ? { onClick: () => void nesteSteg() } : undefined}
                        forrige={forrige ? { onClick: () => void lagre(methods.getValues(), forrige) } : undefined}
                        disabled={lagrer}
                        fortsettSenere={() => lagre(methods.getValues())}
                    />
                </VStack>
            </form>
        </FormProvider>
    )
}

export const SoeknadStegRute = ({ children }: { children: ReactNode }) => {
    const { path, tittel, neste, forrige } = useOutletContext<SoeknadStegContext>()

    return (
        <SoeknadSteg
            key={path}
            tittel={tittel}
            defaultValues={{}}
            oppdaterSoeknad={(soeknad) => ({ ...soeknad, aktivtSteg: path })}
            neste={neste}
            forrige={forrige}
        >
            {children}
        </SoeknadSteg>
    )
}
