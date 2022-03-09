import { Alert, BodyShort, Button, Panel } from '@navikt/ds-react'
import styled from 'styled-components'
import ikon from '../../../assets/ukjent_person.svg'
import { useApplicationContext } from '../../../context/application/ApplicationContext'
import FormGroup from '../../common/FormGroup'
import Navigation from '../../common/Navigation'
import StepHeading from '../../common/StepHeading'
import { StepProps } from '../Dialogue'
import { Infocard, InfocardHeader, InformationBox } from '../../common/card/InfoCard'
import { isEmpty } from 'lodash'
import ParentInfoCard from './ParentInfoCard'
import { ActionTypes, IParent } from '../../../context/application/application'
import { useState } from 'react'
import { ApplicantSituation } from '../scenario/ScenarioSelection'
import LivingParent from './LivingParent'
import DeceasedParent from './DeceasedParent'
import useTranslation from '../../../hooks/useTranslation'

const Wrapper = styled.div`
    .center {
        text-align: center;
    }

    .mute {
        color: #666;
    }
`

const InfocardWrapper = styled.div`
    display: flex;
    flex-flow: row wrap;
    margin: 0 auto;
    column-gap: 1rem;
`

enum EditParent {
    NONE,
    FIRST,
    SECOND,
}

export default function AboutParents({ next, prev }: StepProps) {
    const { t } = useTranslation('aboutParents')
    const { state, dispatch } = useApplicationContext()

    const [editing, setEditing] = useState<EditParent>(EditParent.NONE)

    const stopEditing = () => setEditing(EditParent.NONE)

    const editFirstParent = () => setEditing(EditParent.FIRST)
    const updateFirstParent = (payload: IParent | {}) => dispatch({ type: ActionTypes.UPDATE_FIRST_PARENT, payload })

    const editSecondParent = () => setEditing(EditParent.SECOND)
    const updateSecondParent = (payload: IParent | {}) => dispatch({ type: ActionTypes.UPDATE_SECOND_PARENT, payload })

    const bothParentsDeceased = state.applicant?.applicantSituation === ApplicantSituation.BOTH_PARENTS_DECEASED

    const isValid = !isEmpty(state?.firstParent) && !isEmpty(state?.secondParent)

    return (
        <Wrapper>
            {editing === EditParent.NONE && (
                <>
                    <StepHeading>{t('title')}</StepHeading>

                    <FormGroup>
                        <InfocardWrapper>
                            {isEmpty(state.firstParent) ? (
                                <Infocard>
                                    <InfocardHeader>
                                        <img alt="forelder" src={ikon} />
                                    </InfocardHeader>
                                    <InformationBox>
                                        <strong>{bothParentsDeceased ? t('firstParent') : t('survivingParent')}</strong>
                                    </InformationBox>
                                    <InformationBox>
                                        <Button
                                            title={bothParentsDeceased ? t('firstParent') : t('addSurvivingParentBtn')}
                                            variant={'primary'}
                                            type={'button'}
                                            onClick={editFirstParent}
                                        >
                                            {t('addParentBtn')}
                                        </Button>
                                    </InformationBox>
                                </Infocard>
                            ) : (
                                <ParentInfoCard
                                    parent={state.firstParent!!}
                                    edit={editFirstParent}
                                    remove={() => updateFirstParent({})}
                                />
                            )}

                            {isEmpty(state.secondParent) ? (
                                <Infocard>
                                    <InfocardHeader>
                                        <img alt="forelder" src={ikon} />
                                    </InfocardHeader>
                                    <InformationBox>
                                        <strong>{bothParentsDeceased ? t('secondParent') : t('deceasedParent')}</strong>
                                    </InformationBox>
                                    <InformationBox>
                                        <Button
                                            title={bothParentsDeceased ? t('secondParent') : t('addDeceasedParentBtn')}
                                            variant={'primary'}
                                            type={'button'}
                                            onClick={editSecondParent}
                                        >
                                            {t('addParentBtn')}
                                        </Button>
                                    </InformationBox>
                                </Infocard>
                            ) : (
                                <ParentInfoCard
                                    parent={state.secondParent!!}
                                    edit={editSecondParent}
                                    remove={() => updateSecondParent({})}
                                />
                            )}
                        </InfocardWrapper>
                    </FormGroup>

                    {!isValid && (
                        <FormGroup>
                            <Alert variant={'info'}>
                                <BodyShort size={'small'}>{t('bothParentsRequired')}</BodyShort>
                            </Alert>
                        </FormGroup>
                    )}

                    <Navigation left={{ onClick: prev }} right={{ onClick: next, disabled: !isValid }} />
                </>
            )}

            {editing === EditParent.FIRST && (
                <Panel border={true}>
                    {bothParentsDeceased ? (
                        <DeceasedParent type={ActionTypes.UPDATE_FIRST_PARENT} prev={stopEditing} next={stopEditing} />
                    ) : (
                        <LivingParent type={ActionTypes.UPDATE_FIRST_PARENT} prev={stopEditing} next={stopEditing} />
                    )}
                </Panel>
            )}

            {editing === EditParent.SECOND && (
                <Panel border={true}>
                    <DeceasedParent type={ActionTypes.UPDATE_SECOND_PARENT} prev={stopEditing} next={stopEditing} />
                </Panel>
            )}
        </Wrapper>
    )
}
