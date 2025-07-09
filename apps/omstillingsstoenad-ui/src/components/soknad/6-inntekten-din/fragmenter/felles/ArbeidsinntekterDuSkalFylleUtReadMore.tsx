import { BodyShort, Box, Label, List, ReadMore, VStack } from '@navikt/ds-react'
import { useTranslation } from 'react-i18next'

export const ArbeidsinntekterDuSkalFylleUtReadMore = () => {
    const { t } = useTranslation()

    return (
        <ReadMore header={t('inntektenDin.felles.arbeidsinntekterDuSkalFylleUt.tittel')}>
            <VStack gap="4">
                <VStack>
                    <Label>
                        {t('inntektenDin.felles.arbeidsinntekterDuSkalFylleUt.innhold.arbeidsinntekter.label')}
                    </Label>
                    <List>
                        <List.Item>
                            {t('inntektenDin.felles.arbeidsinntekterDuSkalFylleUt.innhold.arbeidsinntekter.l1')}
                        </List.Item>
                        <List.Item>
                            {t('inntektenDin.felles.arbeidsinntekterDuSkalFylleUt.innhold.arbeidsinntekter.l2')}
                        </List.Item>
                        <List.Item>
                            {t('inntektenDin.felles.arbeidsinntekterDuSkalFylleUt.innhold.arbeidsinntekter.l3')}
                        </List.Item>
                    </List>
                </VStack>

                <VStack>
                    <VStack>
                        <Label>
                            {t('inntektenDin.felles.arbeidsinntekterDuSkalFylleUt.innhold.pengestoetter.label')}
                        </Label>
                        <BodyShort>
                            {t('inntektenDin.felles.arbeidsinntekterDuSkalFylleUt.innhold.pengestoetter.p1')}
                        </BodyShort>
                    </VStack>
                    <List>
                        <List.Item>
                            {t('inntektenDin.felles.arbeidsinntekterDuSkalFylleUt.innhold.pengestoetter.l1')}
                        </List.Item>
                        <List.Item>
                            {t('inntektenDin.felles.arbeidsinntekterDuSkalFylleUt.innhold.pengestoetter.l2')}
                        </List.Item>
                        <List.Item>
                            {t('inntektenDin.felles.arbeidsinntekterDuSkalFylleUt.innhold.pengestoetter.l3')}
                        </List.Item>
                        <List.Item>
                            {t('inntektenDin.felles.arbeidsinntekterDuSkalFylleUt.innhold.pengestoetter.l4')}
                        </List.Item>
                        <List.Item>
                            {t('inntektenDin.felles.arbeidsinntekterDuSkalFylleUt.innhold.pengestoetter.l5')}
                        </List.Item>
                        <List.Item>
                            {t('inntektenDin.felles.arbeidsinntekterDuSkalFylleUt.innhold.pengestoetter.l6')}
                        </List.Item>
                        <List.Item>
                            {t('inntektenDin.felles.arbeidsinntekterDuSkalFylleUt.innhold.pengestoetter.l7')}
                        </List.Item>
                        <List.Item>
                            {t('inntektenDin.felles.arbeidsinntekterDuSkalFylleUt.innhold.pengestoetter.l8')}
                        </List.Item>
                        <List.Item>
                            {t('inntektenDin.felles.arbeidsinntekterDuSkalFylleUt.innhold.pengestoetter.l9')}
                        </List.Item>
                        <List.Item>
                            {t('inntektenDin.felles.arbeidsinntekterDuSkalFylleUt.innhold.pengestoetter.l10')}
                        </List.Item>
                    </List>
                    <BodyShort>
                        {t('inntektenDin.felles.arbeidsinntekterDuSkalFylleUt.innhold.pengestoetter.p2')}
                    </BodyShort>
                </VStack>

                <VStack>
                    <Label>
                        {t('inntektenDin.felles.arbeidsinntekterDuSkalFylleUt.innhold.andreUtbetalinger.label')}
                    </Label>
                    <List>
                        <List.Item>
                            {t('inntektenDin.felles.arbeidsinntekterDuSkalFylleUt.innhold.andreUtbetalinger.l1')}
                        </List.Item>
                        <List.Item>
                            {t('inntektenDin.felles.arbeidsinntekterDuSkalFylleUt.innhold.andreUtbetalinger.l2')}
                        </List.Item>
                    </List>
                </VStack>
            </VStack>
        </ReadMore>
    )
}
