import { Box, Button, Heading, VStack } from '@navikt/ds-react'
import { useEffect } from 'react'
import { FieldArrayWithId, useFieldArray, useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { SkjemaGruppe } from '../../../felles/SkjemaGruppe'
import SelvstendigInfokort from './SelvstendigInfokort'

const Selvstendig = () => {
    const { t } = useTranslation()
    const { control, getValues, setValue } = useFormContext()

    // biome-ignore lint/suspicious/noExplicitAny: gammel kode, venter med å fikse
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
        // biome-ignore lint/suspicious/noExplicitAny: gammel kode, venter med å fikse
        const fjernFraListeBasertPaaIndex = getValues('selvstendig').filter((_: any, i: number) => i !== index)
        setValue('selvstendig', fjernFraListeBasertPaaIndex)
    }

    return (
        <Box marginBlock="0 12">
            <Box marginBlock="4">
                <Heading size={'small'}>{t('merOmSituasjonenDin.selvstendig.tittel')}</Heading>
            </Box>

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
        </Box>
    )
}

export default Selvstendig
