import { Alert, BodyShort, Button, Panel } from '@navikt/ds-react'
import { isEmpty } from 'lodash'
import { useState } from 'react'
import ikon from '../../../assets/ukjent_person.svg'
import { ActionTypes, IParent } from '../../../context/application/application'
import { useApplicationContext } from '../../../context/application/ApplicationContext'
import useTranslation from '../../../hooks/useTranslation'
import { Infocard, InfocardHeader, InfocardWrapper, InformationBox } from '../../common/card/InfoCard'
import FormGroup from '../../common/FormGroup'
import Navigation from '../../common/Navigation'
import StepHeading from '../../common/StepHeading'
import { StepProps } from '../Dialogue'
import { ApplicantSituation } from '../scenario/ScenarioSelection'
import DeceasedParent from './DeceasedParent'
import LivingParent from './LivingParent'
import ParentInfoCard from './ParentInfoCard'

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

    const updateFirstParent = (payload: IParent | {}) => dispatch({ type: ActionTypes.UPDATE_FIRST_PARENT, payload })
    const updateSecondParent = (payload: IParent | {}) => dispatch({ type: ActionTypes.UPDATE_SECOND_PARENT, payload })

    const bothParentsDeceased = state.applicant?.applicantSituation === ApplicantSituation.BOTH_PARENTS_DECEASED

    const isValid = !isEmpty(state?.firstParent) && !isEmpty(state?.secondParent)

    const fnrRegisteredParent = (): string[] => {
        let fnr = ''
        if (editing === EditParent.FIRST && state.secondParent?.fnrDnr) fnr = state.secondParent?.fnrDnr
        if (editing === EditParent.SECOND && state.firstParent?.fnrDnr) fnr = state.firstParent?.fnrDnr
        return [fnr]
    }

    return (
        <>
            {editing === EditParent.NONE && (
                <>
                    <StepHeading>{t('aboutParentsTitle')}</StepHeading>
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
                                            onClick={() => setEditing(EditParent.FIRST)}
                                        >
                                            {t('addParentBtn')}
                                        </Button>
                                    </InformationBox>
                                </Infocard>
                            ) : (
                                <ParentInfoCard
                                    parent={state.firstParent!!}
                                    edit={() => setEditing(EditParent.FIRST)}
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
                                            onClick={() => setEditing(EditParent.SECOND)}
                                        >
                                            {t('addParentBtn')}
                                        </Button>
                                    </InformationBox>
                                </Infocard>
                            ) : (
                                <ParentInfoCard
                                    parent={state.secondParent!!}
                                    edit={() => setEditing(EditParent.SECOND)}
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
                        <DeceasedParent
                            type={ActionTypes.UPDATE_FIRST_PARENT}
                            prev={stopEditing}
                            next={stopEditing}
                            fnrRegisteredParent={fnrRegisteredParent()}
                        />
                    ) : (
                        <LivingParent
                            type={ActionTypes.UPDATE_FIRST_PARENT}
                            prev={stopEditing}
                            next={stopEditing}
                            fnrRegisteredParent={fnrRegisteredParent()}
                        />
                    )}
                </Panel>
            )}

            {editing === EditParent.SECOND && (
                <Panel border={true}>
                    <DeceasedParent
                        type={ActionTypes.UPDATE_SECOND_PARENT}
                        prev={stopEditing}
                        next={stopEditing}
                        fnrRegisteredParent={fnrRegisteredParent()}
                    />
                </Panel>
            )}
        </>
    )
}
