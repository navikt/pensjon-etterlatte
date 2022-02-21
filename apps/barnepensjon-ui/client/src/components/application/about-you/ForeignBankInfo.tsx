import { Heading, TextField } from '@navikt/ds-react'
import FormGroup from '../../common/FormGroup'
import useTranslation from '../../../hooks/useTranslation'
import Hjelpetekst from '../../../utils/Hjelpetekst'

const ForeignBankInfo = () => {
    const { t } = useTranslation('utbetalingsInformasjon')

    return (
        <>
            <FormGroup>
                <Heading size={'small'}>{t('tittel')}</Heading>
            </FormGroup>

            <TextField name={'utenlandskBankNavn'} label={t('utenlandskBankNavn')} />

            <TextField name={'utenlandskBankAdresse'} label={t('utenlandskBankAdresse')} />

            <TextField
                name={'utbetalingsInformasjon.iban'}
                label={
                    <>
                        {t('iban')}
                        &nbsp;
                        <Hjelpetekst>{t('ibanHjelpetekst')}</Hjelpetekst>
                    </>
                }
            />

            <TextField
                name={'utbetalingsInformasjon.swift'}
                label={
                    <>
                        {t('swift')}
                        &nbsp;
                        <Hjelpetekst>{t('swiftHjelpetekst')}</Hjelpetekst>
                    </>
                }
            />
        </>
    )
}

export default ForeignBankInfo
