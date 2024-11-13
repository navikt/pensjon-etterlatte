import { useTranslation } from 'react-i18next'
import { Button, Heading, VStack } from '@navikt/ds-react'
import { FieldArrayWithId, useFieldArray, useFormContext } from 'react-hook-form'
import { useEffect } from 'react'
import SelvstendigInfokort from './SelvstendigInfokort'
import { SkjemaElement } from '../../../felles/SkjemaElement'
import { SkjemaGruppe } from '../../../felles/SkjemaGruppe'

const Selvstendig = () => {
    const { t } = useTranslation()
    const { control, getValues, setValue } = useFormContext()

    const { fields, append } = useFieldArray<any>({
        control,
        name: 'selvstendig',
        shouldUnregister: true,
    })

    useEffect(() => {
        if (fields.length === 0) {
            append({})
        }
    })

    const fjern = (index: number) => {
        const fjernFraListeBasertPaaIndex = getValues('selvstendig').filter((_: any, i: number) => i !== index)
        setValue('selvstendig', fjernFraListeBasertPaaIndex)
    }

    return (
        <SkjemaGruppe>
            <SkjemaElement>
                <Heading size={'small'}>{t('merOmSituasjonenDin.selvstendig.tittel')}</Heading>
            </SkjemaElement>

            <VStack gap="4">
                {fields.map((field: FieldArrayWithId, index: number) => (
                    <SelvstendigInfokort key={field.id} lengde={fields.length} index={index} fjern={fjern} />
                ))}
                <div>
                    <Button variant={'secondary'} type={'button'} onClick={() => append({}, { shouldFocus: true })}>
                        + {t('knapp.leggTilNaeringer')}
                    </Button>
                </div>
            </VStack>
        </SkjemaGruppe>
    )
}

export default Selvstendig
