import { Heading, TextField } from '@navikt/ds-react'
import FormGroup from '../../common/FormGroup'
import useTranslation from '../../../hooks/useTranslation'

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
                        <p>{t('utbetalingsInformasjon:ibanHjelpetekst')}</p>
                    </>
                }
            />

            <TextField
                name={'utbetalingsInformasjon.swift'}
                label={
                    <>
                        {t('utbetalingsInformasjon:swift')}
                        &nbsp;
                        <p>{t('utbetalingsInformasjon:swiftHjelpetekst')}</p>
                    </>
                }
            />
        </>
    )
}

export default ForeignBankInfo
