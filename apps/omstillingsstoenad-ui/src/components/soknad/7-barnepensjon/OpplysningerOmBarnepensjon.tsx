import React, { useState } from 'react'
import ikon from '../../../assets/ikoner/barn1.svg'
import SoknadSteg from '../../../typer/SoknadSteg'
import { useSoknadContext } from '../../../context/soknad/SoknadContext'
import { IBarn, IOmBarn } from '../../../typer/person'
import { ActionTypes } from '../../../context/soknad/soknad'
import { useTranslation } from 'react-i18next'
import BarnInfokort from './BarnInfokort'
import LeggTilBarnSkjema from './LeggTilBarnSkjema'
import { SkjemaGruppe } from '../../felles/SkjemaGruppe'
import { v4 as uuid } from 'uuid'
import Navigasjon from '../../felles/Navigasjon'
import { BodyShort, Button, Heading, GuidePanel } from '@navikt/ds-react'
import { FieldArrayWithId, FormProvider, useFieldArray, useForm } from 'react-hook-form'
import { deepCopy } from '../../../utils/deepCopy'
import styled from 'styled-components'
import { Infokort, InfokortHeader, InfokortInformasjonsboks } from '../../felles/StyledComponents'
import { SkjemaElement } from '../../felles/SkjemaElement'
import { isDev } from '../../../api/axios'

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
                        <SkjemaElement>
                            <Heading size={'medium'} className={'center'}>
                                {t('omBarn.tittel')}
                            </Heading>
                        </SkjemaElement>

                        <SkjemaElement>
                            <GuidePanel>
                                <Heading size={'small'}>{t('omBarn.informasjon.tittel')}</Heading>
                                <BodyShort>{t('omBarn.informasjon')}</BodyShort>
                            </GuidePanel>
                        </SkjemaElement>

                        <SkjemaGruppe>
                            <InfokortWrapper>
                                {fields?.map((field: FieldArrayWithId, index: number) => (
                                    <BarnInfokort
                                        key={uuid()}
                                        barn={field as IBarn}
                                        index={index}
                                        fjern={fjernBarn}
                                        setAktivBarnIndex={() => setAktivBarnIndex(index)}
                                    />
                                ))}

                                <Infokort>
                                    <InfokortHeader $gjennomsiktig>
                                        <img alt="barn" src={ikon} />
                                    </InfokortHeader>
                                    <InfokortInformasjonsboks>
                                        <LeggTilBarnKnappWrapper>
                                            <Button
                                                data-testid={'legg-til-barn-knapp'}
                                                variant={'primary'}
                                                type={'button'}
                                                onClick={leggtilNyttBarn}
                                            >
                                                {t('knapp.leggTilBarn')}
                                            </Button>
                                        </LeggTilBarnKnappWrapper>

                                        <BodyShort size={'small'} className={'center mute'}>
                                            {t('omBarn.valgfritt')}
                                        </BodyShort>
                                    </InfokortInformasjonsboks>
                                </Infokort>
                            </InfokortWrapper>
                        </SkjemaGruppe>

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

const InfokortWrapper = styled.div`
    display: flex;
    flex-flow: row wrap;
    margin: 0 auto;
    column-gap: 1rem;
`

const LeggTilBarnKnappWrapper = styled.div`
    text-align: center;
    margin-bottom: 1rem;
`
