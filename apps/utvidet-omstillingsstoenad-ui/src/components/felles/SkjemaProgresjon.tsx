import { FormProgress } from '@navikt/ds-react'
import { useTranslation } from 'react-i18next'
import { IStegElement } from '~typer/steg'

interface Props {
    aktivtSteg: number
    muligeSteg: IStegElement[]
    settSteg: (value: number) => void
}

export const SkjemaProgresjon = ({ aktivtSteg, muligeSteg, settSteg }: Props) => {
    const { t } = useTranslation()

    return (
        <FormProgress
            totalSteps={muligeSteg.length}
            activeStep={aktivtSteg + 1}
            onStepChange={(step) => settSteg(step - 1)}
            interactiveSteps={false}
            translations={{
                step: t('steg', { aktivSide: aktivtSteg + 1, muligeSteg: muligeSteg.length }),
                showAllSteps: t('visAlleSteg'),
                hideAllSteps: t('skjulAlleSteg'),
            }}
        >
            {muligeSteg.map((steg, index) => (
                <FormProgress.Step key={index} completed={index < aktivtSteg}>
                    {t(steg.label)}
                </FormProgress.Step>
            ))}
        </FormProgress>
    )
}
