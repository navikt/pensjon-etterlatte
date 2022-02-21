import { Heading, TextField } from '@navikt/ds-react'
import FormGroup from '../../common/FormGroup'
import useTranslation from '../../../hooks/useTranslation'
import Hjelpetekst from '../../../utils/Hjelpetekst'

const ForeignBankInfo = () => {
    const { t } = useTranslation()

    return (
        <>
            <FormGroup>
                <Heading size={'small'}>{t('utbetalingsInformasjon:tittel')}</Heading>
            </FormGroup>

            <TextField
                name={'utbetalingsInformasjon.utenlandskBankNavn'}
                label={t('utbetalingsInformasjon:utenlandskBankNavn')}
            />

            <TextField
                name={'utbetalingsInformasjon.utenlandskBankAdresse'}
                label={t('utbetalingsInformasjon:utenlandskBankAdresse')}
            />

            <TextField
                name={'utbetalingsInformasjon.iban'}
                label={
                    <>
                        {t('utbetalingsInformasjon:iban')}
                        &nbsp;
                        <Hjelpetekst>{t('utbetalingsInformasjon:ibanHjelpetekst')}</Hjelpetekst>
                    </>
                }
            />

            <TextField
                name={'utbetalingsInformasjon.swift'}
                label={
                    <>
                        {t('utbetalingsInformasjon:swift')}
                        &nbsp;
                        <Hjelpetekst>{t('utbetalingsInformasjon:swiftHjelpetekst')}</Hjelpetekst>
                    </>
                }
            />
        </>
    )
}

export default ForeignBankInfo
