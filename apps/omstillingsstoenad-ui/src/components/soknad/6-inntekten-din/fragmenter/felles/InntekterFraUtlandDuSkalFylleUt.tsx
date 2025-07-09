import { BodyShort, Label, List, ReadMore, VStack } from '@navikt/ds-react'
import { useTranslation } from 'react-i18next'

export const InntekterFraUtlandDuSkalFylleUt = () => {
    const { t } = useTranslation()

    return (
        <ReadMore header={t('inntektenDin.felles.inntekterFraUtlandDuSkalFylleUt.label')}>
            <VStack gap="4">
                <VStack>
                    <Label>
                        {t('inntektenDin.felles.inntekterFraUtlandDuSkalFylleUt.innhold.arbeidsinntekter.label')}
                    </Label>
                    <List>
                        <List.Item>
                            {t('inntektenDin.felles.inntekterFraUtlandDuSkalFylleUt.innhold.arbeidsinntekter.l1')}
                        </List.Item>
                        <List.Item>
                            {t('inntektenDin.felles.inntekterFraUtlandDuSkalFylleUt.innhold.arbeidsinntekter.l2')}
                        </List.Item>
                        <List.Item>
                            {t('inntektenDin.felles.inntekterFraUtlandDuSkalFylleUt.innhold.arbeidsinntekter.l3')}
                        </List.Item>
                    </List>
                </VStack>

                <VStack>
                    <Label>
                        {t('inntektenDin.felles.inntekterFraUtlandDuSkalFylleUt.innhold.naeringsinntekter.label')}
                    </Label>
                    <List>
                        <List.Item>
                            {t('inntektenDin.felles.inntekterFraUtlandDuSkalFylleUt.innhold.naeringsinntekter.l1')}
                        </List.Item>
                        <List.Item>
                            {t('inntektenDin.felles.inntekterFraUtlandDuSkalFylleUt.innhold.naeringsinntekter.l2')}
                        </List.Item>
                    </List>
                </VStack>

                <VStack>
                    <Label>
                        {t('inntektenDin.felles.inntekterFraUtlandDuSkalFylleUt.innhold.andreUtbetalinger.label')}
                    </Label>
                    <List>
                        <List.Item>
                            {t('inntektenDin.felles.inntekterFraUtlandDuSkalFylleUt.innhold.andreUtbetalinger.l1')}
                        </List.Item>
                        <List.Item>
                            {t('inntektenDin.felles.inntekterFraUtlandDuSkalFylleUt.innhold.andreUtbetalinger.l2')}
                        </List.Item>
                    </List>
                </VStack>

                <VStack>
                    <VStack>
                        <Label>
                            {t(
                                'inntektenDin.felles.inntekterFraUtlandDuSkalFylleUt.innhold.ytelserOgPengestoetter.label'
                            )}
                        </Label>
                        <BodyShort>
                            {t('inntektenDin.felles.inntekterFraUtlandDuSkalFylleUt.innhold.ytelserOgPengestoetter.p')}
                        </BodyShort>
                    </VStack>
                    <List>
                        <List.Item>
                            {t('inntektenDin.felles.inntekterFraUtlandDuSkalFylleUt.innhold.ytelserOgPengestoetter.l1')}
                        </List.Item>
                        <List.Item>
                            {t('inntektenDin.felles.inntekterFraUtlandDuSkalFylleUt.innhold.ytelserOgPengestoetter.l2')}
                        </List.Item>
                        <List.Item>
                            {t('inntektenDin.felles.inntekterFraUtlandDuSkalFylleUt.innhold.ytelserOgPengestoetter.l3')}
                        </List.Item>
                    </List>
                </VStack>
            </VStack>
        </ReadMore>
    )
}
