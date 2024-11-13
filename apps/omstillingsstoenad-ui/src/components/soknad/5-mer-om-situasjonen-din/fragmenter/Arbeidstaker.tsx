import { FieldArrayWithId, useFieldArray, useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Button, Heading, VStack } from '@navikt/ds-react'
import ArbeidstakerInfokort from './ArbeidstakerInfokort'
import { useEffect } from 'react'
import { SkjemaElement } from '../../../felles/SkjemaElement'
import { SkjemaGruppe } from '../../../felles/SkjemaGruppe'

const Arbeidstaker = () => {
    const { t } = useTranslation()

    const { control, setValue, getValues } = useFormContext()

    const { fields, append } = useFieldArray<any>({
        control,
        name: 'arbeidsforhold',
        shouldUnregister: true,
    })

    useEffect(() => {
        if (fields.length === 0) {
            append({})
        }
    })

    const nyttArbeidsforhold = () => {
        if (fields.length < 10) {
            append({}, { shouldFocus: true })
        }
    }

    const fjernArbeidsforhold = (index: number) => {
        const fjernFraListeBasertPaaIndex = getValues('arbeidsforhold').filter((_: any, i: number) => i !== index)
        setValue('arbeidsforhold', fjernFraListeBasertPaaIndex)
    }

    return (
        <SkjemaGruppe>
            <SkjemaElement>
                <Heading size={'small'}>{t('merOmSituasjonenDin.arbeidsforhold.tittel')}</Heading>
            </SkjemaElement>

            <VStack gap="4">
                {fields.map((field: FieldArrayWithId, index: number) => (
                    <ArbeidstakerInfokort
                        key={field.id}
                        lengde={fields.length}
                        index={index}
                        fjern={fjernArbeidsforhold}
                    />
                ))}

                <div>
                    <Button
                        variant={'secondary'}
                        type={'button'}
                        onClick={nyttArbeidsforhold}
                        disabled={fields.length >= 10}
                        data-testid={'legg-til-arbeidsforhold-knapp'}
                    >
                        + {t('knapp.leggTilArbeidsforhold')}
                    </Button>
                </div>
            </VStack>
        </SkjemaGruppe>
    )
}

export default Arbeidstaker
