import { useTranslation } from 'react-i18next'
import { Button, Heading } from '@navikt/ds-react'
import { FieldArrayWithId, useFieldArray, useFormContext } from 'react-hook-form'
import { useEffect } from 'react'
import SelvstendigInfokort from './SelvstendigInfokort'
import { SkjemaElement } from '../../../felles/SkjemaElement'
import { SkjemaGruppe } from '../../../felles/SkjemaGruppe'


const Selvstendig = () => {
    const { t } = useTranslation()
    const { control } = useFormContext()

    const { fields, append, remove } = useFieldArray<any>({
        control,
        name: 'selvstendig',
        shouldUnregister: true,
    })

    useEffect(() => {
        if (fields.length === 0) {
            append({})
        }
    })

    return (
        <SkjemaGruppe>
            <SkjemaElement>
                <Heading size={'small'}>{t('merOmSituasjonenDin.selvstendig.tittel')}</Heading>
            </SkjemaElement>

            {fields.map((field: FieldArrayWithId, index: number) => (
                <SelvstendigInfokort key={field.id} lengde={fields.length} index={index} fjern={remove} />
            ))}

            <Button variant={'secondary'} type={'button'} onClick={() => append({}, { shouldFocus: true })}>
                + {t('knapp.leggTilNaeringer')}
            </Button>
        </SkjemaGruppe>
    )
}

export default Selvstendig
