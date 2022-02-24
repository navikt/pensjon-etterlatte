import useTranslation from '../../../hooks/useTranslation'
import { BankkontoType } from '../../../api/dto/FellesOpplysninger'
import FormGroup from '../../common/FormGroup'
import { Heading } from '@navikt/ds-react'
import { RHFBicInput, RHFIbanInput, RHFInput, RHFKontonummerInput } from '../../common/rhf/RHFInput'
import Hjelpetekst from '../../../utils/Hjelpetekst'
import { RHFInlineRadio } from '../../common/rhf/RHFRadio'
import { RadioProps } from 'nav-frontend-skjema'

export default function PaymentDetails({
    hideSelectType,
    accountType,
}: {
    hideSelectType?: boolean
    accountType: BankkontoType
}) {
    const { t } = useTranslation('utbetalingsInformasjon')

    return (
        <>
            {!hideSelectType && (
                <RHFInlineRadio
                    name={'utbetalingsInformasjon.bankkontoType'}
                    legend={t('bankkontoType')}
                    radios={Object.values(BankkontoType).map((value) => {
                        return { label: t(value), value } as RadioProps
                    })}
                />
            )}

            {accountType === BankkontoType.NORSK && (
                <FormGroup>
                    <RHFKontonummerInput
                        bredde={'S'}
                        name={'utbetalingsInformasjon.kontonummer'}
                        label={t('kontonummer')}
                        description={t('informasjon')}
                    />
                </FormGroup>
            )}

            {accountType === BankkontoType.UTENLANDSK && (
                <>
                    <FormGroup>
                        <Heading size={'small'}>{t('tittel')}</Heading>
                    </FormGroup>

                    <RHFInput name={'utenlandskBankNavn'} label={t('utenlandskBankNavn')} />

                    <RHFInput name={'utenlandskBankAdresse'} label={t('utenlandskBankAdresse')} />

                    <RHFIbanInput
                        name={'utbetalingsInformasjon.iban'}
                        label={
                            <>
                                {t('iban')}
                                &nbsp;
                                <Hjelpetekst>{t('ibanHjelpetekst')}</Hjelpetekst>
                            </>
                        }
                    />

                    <RHFBicInput
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
            )}
        </>
    )
}
