import { BodyShort, Button, Checkbox, GuidePanel, Heading, Modal, Panel } from '@navikt/ds-react'
import { isEmpty } from 'lodash'
import React, { useState } from 'react'
import ikon from '../../../assets/ukjent_person.svg'
import { ActionTypes, IParent } from '../../../context/application/application'
import { useApplicationContext } from '../../../context/application/ApplicationContext'
import useTranslation from '../../../hooks/useTranslation'
import { Infocard, InfocardHeader, InfocardWrapper, InformationBox } from '../../common/card/InfoCard'
import FormGroup from '../../common/FormGroup'
import Navigation from '../../common/Navigation'
import StepHeading from '../../common/StepHeading'
import { StepProps } from '../Dialogue'
import DeceasedParent from './DeceasedParent'
import LivingParent from './LivingParent'
import ParentInfoCard from './ParentInfoCard'
import { FormProvider, useForm } from 'react-hook-form'
import FormElement from '../../common/FormElement'
import { ApplicantRole, ApplicantSituation } from '../../../types/applicant'

enum EditParent {
    NONE,
    FIRST,
    SECOND,
}

export default function AboutParents({ next, prev }: StepProps) {
    const [isOpen, setIsOpen] = useState(false)
    const { t } = useTranslation('aboutParents')
    const { state, dispatch } = useApplicationContext()

    const [editing, setEditing] = useState<EditParent>(EditParent.NONE)

    const stopEditing = () => setEditing(EditParent.NONE)

    const updateFirstParent = (payload: IParent | {}) => dispatch({ type: ActionTypes.UPDATE_FIRST_PARENT, payload })
    const updateSecondParent = (payload: IParent | {}) => dispatch({ type: ActionTypes.UPDATE_SECOND_PARENT, payload })
    const updateUnknownParent = (payload: boolean) => dispatch({ type: ActionTypes.UPDATE_UNKNOWN_PARENT, payload })

    const isChild = state.applicant?.applicantRole === ApplicantRole.CHILD
    const isGuardian = state.applicant?.applicantRole === ApplicantRole.GUARDIAN

    const bothParentsDeceased = state.applicant?.applicantSituation === ApplicantSituation.BOTH_PARENTS_DECEASED

    const childAndOneParentDeceased = isChild && !bothParentsDeceased

    const guardianAndOneParentDeceased = isGuardian && !bothParentsDeceased

    const childAndBothParentsDeceased = isChild && bothParentsDeceased

    const methods = useForm<any>({
        defaultValues: { unknownParent: !!state.unknownParent },
        shouldUnregister: true,
    })

    const { watch, setValue, handleSubmit, getValues } = methods

    const unknownParent = watch('unknownParent')

    const save = () => {
        const values = getValues()
        updateUnknownParent(values.unknownParent)
        next!!()
    }

    const setUnknownParent = (value: boolean) => {
        setValue('unknownParent', value)
        updateUnknownParent(value)
    }

    const isValid = () => {
        if (childAndOneParentDeceased || guardianAndOneParentDeceased) return !isEmpty(state?.secondParent)
        return !isEmpty(state?.firstParent) && (!isEmpty(state?.secondParent) || !!state.unknownParent)
    }

    const fnrRegisteredParent = (): string[] => {
        let fnr = ''
        if (editing === EditParent.FIRST && state.secondParent?.fnrDnr) fnr = state.secondParent?.fnrDnr
        if (editing === EditParent.SECOND && state.firstParent?.fnrDnr) fnr = state.firstParent?.fnrDnr
        return [fnr]
    }

    const updateEditing = (value: EditParent) => {
        setEditing(value)
        if (unknownParent !== undefined) setUnknownParent(unknownParent)
    }

    const guidePanelText = () => {
        if (childAndOneParentDeceased) return t('childAndOneParentDeceasedGuidepanel')
        if (childAndBothParentsDeceased) return t('childAndBothParentsDeceasedGuidepanel')
        if (guardianAndOneParentDeceased) return t('guardianAndOneParentDeceased')
        if (bothParentsDeceased) return t('chooseUnknowParent')
        else return t('bothParentsRequired')
    }

    return (
        <FormProvider {...methods}>
            {editing === EditParent.NONE && (
                <>
                    <StepHeading>{t('aboutParentsTitle')}</StepHeading>
                    <FormGroup>
                        <GuidePanel>
                            <BodyShort>{guidePanelText()}</BodyShort>
                        </GuidePanel>
                    </FormGroup>

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
                                        {childAndOneParentDeceased || guardianAndOneParentDeceased ? (
                                            <BodyShort>{t('childAndOneParentDeceased')}</BodyShort>
                                        ) : (
                                            <Button
                                                title={
                                                    bothParentsDeceased ? t('firstParent') : t('addSurvivingParentBtn')
                                                }
                                                variant={'primary'}
                                                type={'button'}
                                                onClick={() => updateEditing(EditParent.FIRST)}
                                            >
                                                {t('addParentBtn')}
                                            </Button>
                                        )}
                                    </InformationBox>
                                </Infocard>
                            ) : (
                                <ParentInfoCard
                                    parent={state.firstParent!!}
                                    edit={() => updateEditing(EditParent.FIRST)}
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
                                        <div style={{ marginBottom: '1rem' }}>
                                            <Button
                                                title={
                                                    bothParentsDeceased ? t('secondParent') : t('addDeceasedParentBtn')
                                                }
                                                variant={'primary'}
                                                type={'button'}
                                                onClick={() => updateEditing(EditParent.SECOND)}
                                                disabled={state.unknownParent}
                                            >
                                                {t('addParentBtn')}
                                            </Button>
                                        </div>

                                        {bothParentsDeceased && (
                                            <Checkbox
                                                value={true}
                                                onClick={() => {
                                                    if (state.unknownParent) {
                                                        setUnknownParent(false)
                                                    } else {
                                                        setIsOpen(true)
                                                    }
                                                }}
                                                checked={!!state.unknownParent}
                                            >
                                                {t('unknownParent')}
                                            </Checkbox>
                                        )}
                                    </InformationBox>
                                </Infocard>
                            ) : (
                                <ParentInfoCard
                                    parent={state.secondParent!!}
                                    edit={() => updateEditing(EditParent.SECOND)}
                                    remove={() => updateSecondParent({})}
                                />
                            )}
                        </InfocardWrapper>
                    </FormGroup>

                    <Navigation
                        left={{ onClick: prev }}
                        right={{ onClick: handleSubmit(save), disabled: !isValid() }}
                    />
                </>
            )}

            {editing === EditParent.FIRST && (
                <FormElement>
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
                </FormElement>
            )}

            {editing === EditParent.SECOND && (
                <FormElement>
                    <Panel border={true}>
                        <DeceasedParent
                            type={ActionTypes.UPDATE_SECOND_PARENT}
                            prev={stopEditing}
                            next={stopEditing}
                            fnrRegisteredParent={fnrRegisteredParent()}
                        />
                    </Panel>
                </FormElement>
            )}

            <Modal open={isOpen} onClose={() => setIsOpen(false)}>
                <Modal.Header>
                    <Heading size={'small'}>{t('unknownParent')}</Heading>
                </Modal.Header>
                <Modal.Body>
                    <BodyShort>{isChild ? t('unknownParentQuestion') : t('unknownParentQuestionGuardian')}</BodyShort>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        id={'avbryt-ja-btn'}
                        variant={'primary'}
                        type={'button'}
                        onClick={() => {
                            setUnknownParent(true)
                            setIsOpen(false)
                        }}
                        style={{ margin: '10px' }}
                    >
                        {isChild ? t('yesUnknownParent', { ns: 'btn' }) : t('yesUnknownParentGuardian', { ns: 'btn' })}
                    </Button>
                    <Button
                        id={'avbryt-nei-btn'}
                        variant={'secondary'}
                        type={'button'}
                        onClick={() => {
                            setUnknownParent(false)
                            setIsOpen(false)
                        }}
                        style={{ margin: '10px' }}
                    >
                        {isChild ? t('noUnknownParent', { ns: 'btn' }) : t('noUnknownParentGuardian', { ns: 'btn' })}
                    </Button>
                </Modal.Footer>
            </Modal>
        </FormProvider>
    )
}
