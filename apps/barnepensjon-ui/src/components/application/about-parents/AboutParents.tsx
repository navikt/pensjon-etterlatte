import { Alert, BodyShort, Button, Checkbox, CheckboxGroup, Heading, Modal, Panel } from '@navikt/ds-react'
import { isEmpty } from 'lodash'
import React, { useCallback, useEffect, useState } from 'react'
import ikon from '../../../assets/ukjent_person.svg'
import { ActionTypes, IParent } from '../../../context/application/application'
import { useApplicationContext } from '../../../context/application/ApplicationContext'
import useTranslation from '../../../hooks/useTranslation'
import { Infocard, InfocardHeader, InfocardWrapper, InformationBox } from '../../common/card/InfoCard'
import FormGroup from '../../common/FormGroup'
import Navigation from '../../common/Navigation'
import StepHeading from '../../common/StepHeading'
import { StepProps } from '../Dialogue'
import { ApplicantRole, ApplicantSituation } from '../scenario/ScenarioSelection'
import DeceasedParent from './DeceasedParent'
import LivingParent from './LivingParent'
import ParentInfoCard from './ParentInfoCard'
import Trans from '../../common/Trans'
import { FormProvider, useForm } from 'react-hook-form'

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

    const bothParentsDeceased = state.applicant?.applicantSituation === ApplicantSituation.BOTH_PARENTS_DECEASED

    const childAndOneParentDeceased =
        state.applicant?.applicantRole === ApplicantRole.CHILD &&
        state.applicant?.applicantSituation === ApplicantSituation.ONE_PARENT_DECEASED

    const methods = useForm<any>({
        defaultValues: { ...state },
        shouldUnregister: true,
    })

    const save = (data: any) => {
        updateUnknownParent(data.unknownParent)
        next!!()
    }

    const { watch, setValue, handleSubmit } = methods

    const unknownParent = watch('unknownParent')

    const setUnknownParent = useCallback((value: boolean | undefined) => {
        if (value !== undefined && value !== unknownParent) {
            setValue('unknownParent', value)
            updateUnknownParent(value)
        }
    }, [updateUnknownParent])

    const isValid = () => {
        if (childAndOneParentDeceased) return !isEmpty(state?.secondParent)
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
        setUnknownParent(unknownParent)
    }

    useEffect(() => {
        setUnknownParent(state.unknownParent)
    }, [setUnknownParent])

    return (
        <FormProvider {...methods}>
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
                                        {childAndOneParentDeceased ? (
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

                                        <CheckboxGroup legend={''} value={[state.unknownParent || false]}>
                                            <Checkbox
                                                value={true}
                                                onClick={() => {
                                                    if (state.unknownParent) {
                                                        setUnknownParent(false)
                                                    } else {
                                                        setIsOpen(true)
                                                    }
                                                }}
                                            >
                                                {t('unknownParent')}
                                            </Checkbox>
                                        </CheckboxGroup>
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

                    <FormGroup>
                        <Alert variant={'info'}>
                            <BodyShort size={'small'}>
                                {childAndOneParentDeceased ? t('bothParentsRequiredOver18') : t('bothParentsRequired')}
                                {!childAndOneParentDeceased && <Trans value={t('missingOneParentLink')} />}
                            </BodyShort>
                        </Alert>
                    </FormGroup>

                    <Navigation
                        left={{ onClick: prev }}
                        right={{ onClick: handleSubmit(save), disabled: !isValid() }}
                    />
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

            <Modal open={isOpen} onClose={() => setIsOpen(false)}>
                <Modal.Header>
                    <Heading size={'small'}>Er din forelder ukjent?</Heading>
                </Modal.Header>
                <Modal.Body>
                    <BodyShort>Kan du bekrefte at du ikke kjenner til din forelder?</BodyShort>
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
                        {t('yesUnknownParent', { ns: 'btn' })}
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
                        {t('noUnknownParent', { ns: 'btn' })}
                    </Button>
                </Modal.Footer>
            </Modal>
        </FormProvider>
    )
}
