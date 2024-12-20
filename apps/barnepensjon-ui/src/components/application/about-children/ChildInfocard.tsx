import { DeleteFilled, EditFilled } from '@navikt/ds-icons'
import { BodyShort, Box, Button, Heading, Tag, VStack } from '@navikt/ds-react'
import { memo } from 'react'
import { JaNeiVetIkke } from '../../../api/dto/FellesOpplysninger'
import ikon from '../../../assets/barn1.svg'
import useTranslation from '../../../hooks/useTranslation'
import { Infocard, InfocardHeader, InformationBox, InformationBoxContent } from '../../common/card/InfoCard'
import { IChild } from '../../../types/person'
import FormElement from '../../common/FormElement'
import { format } from 'date-fns'

interface Props {
    child: IChild
    index: number
    remove: (index: number) => void
    setActiveChildIndex: () => void
}

const ChildInfoCard = memo(({ child, index, remove, setActiveChildIndex }: Props) => {
    const { t } = useTranslation('aboutChildren')

    const foedselsnummer = child.fnrDnr?.replace(/(\d{6})(.*)/, '$1 $2')

    return (
        <Infocard>
            <InfocardHeader>
                <img alt="barn" src={ikon} />
            </InfocardHeader>

            <InformationBox>
                <InformationBoxContent>
                    <Heading size={'small'}>
                        {child.firstName} {child.lastName}
                    </Heading>
                </InformationBoxContent>
                <Box paddingBlock="2">
                    {foedselsnummer && (
                        <>
                            <BodyShort>{t('infoCard_fnr')}</BodyShort>
                            <BodyShort spacing>{foedselsnummer}</BodyShort>
                        </>
                    )}
                    {child.dateOfBirth && (
                        <>
                            <BodyShort>{t('infoCard_dob')}</BodyShort>
                            <BodyShort spacing>{format(child.dateOfBirth, 'dd.MM.yyyy')}</BodyShort>
                        </>
                    )}

                    <BodyShort>{t('infoCard_citizenship')}</BodyShort>
                    <BodyShort spacing>{child.citizenship}</BodyShort>

                    <BodyShort>{t('infoCard_residence')}</BodyShort>
                    <BodyShort spacing>
                        {t('livesIn')}&nbsp;
                        {child.staysAbroad?.answer === JaNeiVetIkke.JA
                            ? child.staysAbroad?.country
                            : t('norway', { ns: 'common' })}
                    </BodyShort>

                    {!!child.appliesForChildrensPension ? (
                        <FormElement>
                            <Tag variant={'success'}>{t('childAppliedForPension')}</Tag>
                        </FormElement>
                    ) : (
                        <FormElement>
                            <Tag variant={'warning'}>{t('childNotApplyingForPension')}</Tag>
                        </FormElement>
                    )}
                </Box>
                <VStack gap="2">
                    <Button
                        type="button"
                        icon={<EditFilled fontSize={18} aria-hidden />}
                        onClick={setActiveChildIndex}
                        variant="tertiary"
                    >
                        {t('editButton', { ns: 'btn' })}
                    </Button>
                    <Button
                        type="button"
                        icon={<DeleteFilled fontSize={18} aria-hidden />}
                        onClick={() => remove(index)}
                        variant="tertiary"
                    >
                        {t('removeChildButton')}
                    </Button>
                </VStack>
            </InformationBox>
        </Infocard>
    )
})

export default ChildInfoCard
