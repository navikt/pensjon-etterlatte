import { List, ReadMore } from '@navikt/ds-react'
import { useTranslation } from 'react-i18next'

export const NaeringsinntekterDuSkalFylleUtReadMore = () => {
    const { t } = useTranslation()

    return (
        <ReadMore header={t('inntektenDin.felles.naeringsinntekterDuSkalFylleUt.label')}>
            <List>
                <List.Item>{t('inntektenDin.felles.naeringsinntekterDuSkalFylleUt.innhold.l1')}</List.Item>
                <List.Item>{t('inntektenDin.felles.naeringsinntekterDuSkalFylleUt.innhold.l2')}</List.Item>
            </List>
        </ReadMore>
    )
}
