import { FieldArrayWithId, useFieldArray, useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Button, Heading } from '@navikt/ds-react'
import ArbeidstakerInfokort from './ArbeidstakerInfokort'
import { useEffect } from 'react'
import { SkjemaElement } from '../../../felles/SkjemaElement'
import { SkjemaGruppe } from '../../../felles/SkjemaGruppe'

const Arbeidstaker = () => {
    const { t } = useTranslation()

    const { control } = useFormContext()

    const { fields, append, remove } = useFieldArray<any>({
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

    return (
        <SkjemaGruppe>
            <SkjemaElement>
                <Heading size={'small'}>{t('merOmSituasjonenDin.arbeidsforhold.tittel')}</Heading>
            </SkjemaElement>

            {fields.map((field: FieldArrayWithId, index: number) => (
                <ArbeidstakerInfokort key={field.id} lengde={fields.length} index={index} fjern={remove} />
            ))}

            <Button variant={'secondary'} type={'button'} onClick={nyttArbeidsforhold} disabled={fields.length >= 10}>
                + {t('knapp.leggTilArbeidsforhold')}
            </Button>
        </SkjemaGruppe>
    )
}

export default Arbeidstaker
