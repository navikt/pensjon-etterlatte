import { BodyShort, Box, Button, GuidePanel, Heading, HGrid, HStack, VStack } from '@navikt/ds-react'
import React, { useState } from 'react'
import { FieldArrayWithId, FormProvider, useFieldArray, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { v4 as uuid } from 'uuid'
import { isDev } from '../../../api/axios'
import ikon from '../../../assets/ikoner/barn1.svg'
import { useSoknadContext } from '../../../context/soknad/SoknadContext'
import { ActionTypes } from '../../../context/soknad/soknad'
import { IBarn, IOmBarn } from '../../../typer/person'
import SoknadSteg from '../../../typer/SoknadSteg'
import { deepCopy } from '../../../utils/deepCopy'
import Navigasjon from '../../felles/Navigasjon'
import BarnInfokort from './BarnInfokort'
import LeggTilBarnSkjema from './LeggTilBarnSkjema'

const OpplysningerOmBarnepensjon = ({ neste, forrige }: SoknadSteg) => {
    const { t } = useTranslation()
    const { state, dispatch } = useSoknadContext()

    const methods = useForm<IOmBarn>({
        defaultValues: state.opplysningerOmBarn || {},
    })

    const { watch, getValues } = methods

    const erValidert = state.opplysningerOmBarn.erValidert
    const registrerteBarn = watch('barn')

    const getFnrRegistrerteBarn = (): string[] => {
        if (registrerteBarn !== undefined) {
            return registrerteBarn.map((barn) => (barn.foedselsnummer !== undefined ? barn.foedselsnummer : ''))
        } else {
            return []
        }
    }

    const fnrRegistrerteBarn = (aktivBarnIndex: number): string[] => {
        const fnr = getFnrRegistrerteBarn()
        fnr.splice(aktivBarnIndex, 1)
        return fnr
    }

    const { fields, append, update, remove } = useFieldArray({
        name: 'barn',
        control: methods.control,
    })

    const [aktivBarnIndex, setAktivBarnIndex] = useState<number | undefined>(undefined)

    const leggtilNyttBarn = () => {
        append({})
        setAktivBarnIndex(fields.length)
    }

    const avbryt = (fjernAktivtBarn?: boolean) => {
        if (fjernAktivtBarn) remove(aktivBarnIndex)
        setAktivBarnIndex(undefined)
    }

    const fjernBarn = (index: number) => {
        remove(index)
        const verdier = getValues()
        dispatch({ type: ActionTypes.OPPDATER_OM_BARN, payload: { ...deepCopy(verdier) } })
    }

    const oppdaterBarn = (barn: IBarn) => {
        if (aktivBarnIndex !== undefined) {
            update(aktivBarnIndex, barn)
            const verdier = getValues()
            dispatch({ type: ActionTypes.OPPDATER_OM_BARN, payload: { ...deepCopy(verdier) } })
        }
        setAktivBarnIndex(undefined)
    }

    const lagreNeste = (data: IOmBarn) => {
        dispatch({ type: ActionTypes.OPPDATER_OM_BARN, payload: { ...deepCopy(data), erValidert: true } })
        neste!()
    }

    const lagreTilbake = (data: IOmBarn) => {
        dispatch({ type: ActionTypes.OPPDATER_OM_BARN, payload: { ...deepCopy(data), erValidert: true } })
        forrige!()
    }

    const lagreTilbakeUtenValidering = () => {
        const verdier = getValues()
        dispatch({ type: ActionTypes.OPPDATER_OM_BARN, payload: { ...deepCopy(verdier), erValidert: false } })
        forrige!()
    }

    const { handleSubmit } = methods

    return (
        <FormProvider {...methods}>
            <form autoComplete={isDev ? 'on' : 'off'}>
                {aktivBarnIndex === undefined && (
                    <>
                        <Box marginBlock="4">
                            <Heading size={'medium'} className={'center'}>
                                {t('omBarn.tittel')}
                            </Heading>
                        </Box>

                        <Box marginBlock="4">
                            <GuidePanel>
                                <Heading size={'small'}>{t('omBarn.informasjon.tittel')}</Heading>
                                <BodyShort>{t('omBarn.informasjon')}</BodyShort>
                            </GuidePanel>
                        </Box>

                        <Box marginBlock="0 12">
                            <HGrid gap="4" columns={{ sm: 1, md: 2 }}>
                                {fields?.map((field: FieldArrayWithId, index: number) => (
                                    <BarnInfokort
                                        key={uuid()}
                                        barn={field as IBarn}
                                        index={index}
                                        fjern={fjernBarn}
                                        setAktivBarnIndex={() => setAktivBarnIndex(index)}
                                    />
                                ))}
                                <Box background="bg-subtle" marginBlock="0 4" borderRadius="0 0 4 4">
                                    <Box
                                        borderRadius="4 4 0 0"
                                        height="128px"
                                        borderWidth="0 0 4 0"
                                        style={{
                                            backgroundColor: '#4d3e55',
                                            borderBottomColor: '#826ba1',
                                            opacity: 0.4,
                                        }}
                                    >
                                        <HStack justify="center" align="end" height="100%">
                                            <img alt="barn" src={ikon} />
                                        </HStack>
                                    </Box>
                                    <Box padding="8">
                                        <HStack marginBlock="0 4" justify="center">
                                            <Button
                                                data-testid={'legg-til-barn-knapp'}
                                                variant={'primary'}
                                                type={'button'}
                                                onClick={leggtilNyttBarn}
                                            >
                                                {t('knapp.leggTilBarn')}
                                            </Button>
                                        </HStack>

                                        <BodyShort size={'small'} className={'center mute'}>
                                            {t('omBarn.valgfritt')}
                                        </BodyShort>
                                    </Box>
                                </Box>
                            </HGrid>
                        </Box>

                        <Navigasjon
                            forrige={{
                                onClick: erValidert === true ? handleSubmit(lagreTilbake) : lagreTilbakeUtenValidering,
                            }}
                            neste={{ onClick: handleSubmit(lagreNeste) }}
                        />
                    </>
                )}

                {aktivBarnIndex !== undefined && (
                    <LeggTilBarnSkjema
                        lagre={oppdaterBarn}
                        avbryt={avbryt}
                        fnrRegistrerteBarn={fnrRegistrerteBarn(aktivBarnIndex)}
                        barn={fields[aktivBarnIndex] as IBarn}
                    />
                )}
            </form>
        </FormProvider>
    )
}

export default OpplysningerOmBarnepensjon
