import { BodyShort, Box, Button, Checkbox, GuidePanel, Heading, HGrid, HStack, Modal, VStack } from '@navikt/ds-react'
import { isEmpty } from 'lodash'
import React, { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import ErrorSummaryWrapper from '~components/common/ErrorSummaryWrapper'
import { useApplicationContext } from '~context/application/ApplicationContext'
import { ActionTypes, IDeceasedParent, IParent } from '~context/application/application'
import { ApplicantRole, ApplicantSituation } from '~types/applicant'
import ikon from '../../../assets/ukjent_person.svg'
import useTranslation from '../../../hooks/useTranslation'
import Navigation from '../../common/Navigation'
import { StepProps } from '../Dialogue'
import DeceasedParent from './DeceasedParent'
import LivingParent from './LivingParent'
import ParentInfoCard from './ParentInfoCard'

enum EditParent {
    NONE,
    FIRST,
    SECOND,
}

const getValidationError = (firstParent?: IParent, secondParent?: IParent) => {
    const firstParentError =
        !(firstParent as IDeceasedParent)?.isValidated && !isEmpty(firstParent)
            ? {
                  deceasedParentOne: {
                      message: '',
                      type: 'required',
                      ref: {
                          name: 'deceasedParentOne',
                      },
                  },
              }
            : null

    const secondParentError =
        !(secondParent as IDeceasedParent)?.isValidated && !isEmpty(secondParent)
            ? {
                  deceasedParentTwo: {
                      message: '',
                      type: 'required',
                      ref: {
                          name: 'deceasedParentTwo',
                      },
                  },
              }
            : null

    return { ...firstParentError, ...secondParentError }
}

export default function AboutParents({ next, prev }: StepProps) {
    const [isOpen, setIsOpen] = useState(false)
    const { t } = useTranslation('aboutParents')
    const { state, dispatch } = useApplicationContext()

    const [editing, setEditing] = useState<EditParent>(EditParent.NONE)

    const stopEditing = () => setEditing(EditParent.NONE)

    const updateFirstParent = (payload: IParent | Record<string, never>) =>
        dispatch({ type: ActionTypes.UPDATE_FIRST_PARENT, payload })
    const updateSecondParent = (payload: IParent | Record<string, never>) =>
        dispatch({ type: ActionTypes.UPDATE_SECOND_PARENT, payload })
    const updateUnknownParent = (payload: boolean) => dispatch({ type: ActionTypes.UPDATE_UNKNOWN_PARENT, payload })

    const isChild = state.applicant?.applicantRole === ApplicantRole.CHILD
    const isGuardian = state.applicant?.applicantRole === ApplicantRole.GUARDIAN

    const bothParentsDeceased = state.applicant?.applicantSituation === ApplicantSituation.BOTH_PARENTS_DECEASED

    const childAndOneParentDeceased = isChild && !bothParentsDeceased

    const guardianAndOneParentDeceased = isGuardian && !bothParentsDeceased

    const childAndBothParentsDeceased = isChild && bothParentsDeceased

    const methods = useForm({
        defaultValues: { unknownParent: !!state.unknownParent },
        shouldUnregister: true,
    })

    const { watch, setValue, handleSubmit, getValues } = methods

    const unknownParent = watch('unknownParent')

    const save = () => {
        const values = getValues()
        updateUnknownParent(values.unknownParent)
        next!()
    }

    const setUnknownParent = (value: boolean) => {
        setValue('unknownParent', value)
        updateUnknownParent(value)
    }

    const isValid = () => {
        if (childAndOneParentDeceased || guardianAndOneParentDeceased) {
            return !!(state?.secondParent as IDeceasedParent)?.isValidated
        }
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
                    <VStack marginBlock="12 8" align="center">
                        <Heading size={'medium'}>{t('aboutParentsTitle')}</Heading>
                    </VStack>
                    <Box marginBlock="0 8">
                        <GuidePanel>
                            <BodyShort>{guidePanelText()}</BodyShort>
                        </GuidePanel>
                    </Box>

                    <Box marginBlock="0 8">
                        <HGrid gap="4" columns={{ sm: 1, md: 2 }}>
                            {isEmpty(state.firstParent) ? (
                                <Box background="bg-subtle" marginBlock="0 4" borderRadius="0 0 4 4">
                                    <Box
                                        borderRadius="4 4 0 0"
                                        height="128px"
                                        borderWidth="0 0 4 0"
                                        style={{
                                            backgroundColor: '#4d3e55',
                                            borderBottomColor: '#826ba1',
                                            opacity: 0.4,
                                        }}
                                    >
                                        <HStack justify="center" align="end" height="100%">
                                            <img alt="forelder" src={ikon} />
                                        </HStack>
                                    </Box>
                                    <Box paddingBlock="8">
                                        <HStack marginBlock="0 4" justify="center">
                                            <strong>
                                                {bothParentsDeceased ? t('firstParent') : t('survivingParent')}
                                            </strong>
                                        </HStack>
                                    </Box>
                                    <Box paddingBlock="8">
                                        <HStack paddingInline="2" marginBlock="0 4" justify="center">
                                            {childAndOneParentDeceased || guardianAndOneParentDeceased ? (
                                                <BodyShort>{t('childAndOneParentDeceased')}</BodyShort>
                                            ) : (
                                                <Button
                                                    title={
                                                        bothParentsDeceased
                                                            ? t('firstParent')
                                                            : t('addSurvivingParentBtn')
                                                    }
                                                    variant={'primary'}
                                                    type={'button'}
                                                    onClick={() => updateEditing(EditParent.FIRST)}
                                                >
                                                    {t('addParentBtn')}
                                                </Button>
                                            )}
                                        </HStack>
                                    </Box>
                                </Box>
                            ) : (
                                <ParentInfoCard
                                    parent={state.firstParent!}
                                    edit={() => updateEditing(EditParent.FIRST)}
                                    remove={() => updateFirstParent({})}
                                    isValidated={(state.firstParent as IDeceasedParent)?.isValidated}
                                    firstParent={true}
                                />
                            )}

                            {isEmpty(state.secondParent) ? (
                                <Box background="bg-subtle" marginBlock="0 4" borderRadius="0 0 4 4">
                                    <Box
                                        borderRadius="4 4 0 0"
                                        height="128px"
                                        borderWidth="0 0 4 0"
                                        style={{
                                            backgroundColor: '#4d3e55',
                                            borderBottomColor: '#826ba1',
                                            opacity: 0.4,
                                        }}
                                    >
                                        <HStack justify="center" align="end" height="100%">
                                            <img alt="forelder" src={ikon} />
                                        </HStack>
                                    </Box>
                                    <Box padding="8">
                                        <HStack marginBlock="0 4" justify="center">
                                            <strong>
                                                {bothParentsDeceased ? t('secondParent') : t('deceasedParent')}
                                            </strong>
                                        </HStack>
                                    </Box>
                                    <Box padding="8">
                                        <HStack gap="4" marginBlock="0 4" justify="center">
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
                                        </HStack>
                                    </Box>
                                </Box>
                            ) : (
                                <ParentInfoCard
                                    parent={state.secondParent!}
                                    edit={() => updateEditing(EditParent.SECOND)}
                                    remove={() => updateSecondParent({})}
                                    isValidated={(state.secondParent as IDeceasedParent)?.isValidated}
                                    firstParent={false}
                                />
                            )}
                        </HGrid>
                    </Box>

                    <ErrorSummaryWrapper errors={getValidationError(state.firstParent, state.secondParent)} />

                    <Navigation
                        left={{ onClick: prev }}
                        right={{ onClick: handleSubmit(save), disabled: !isValid() }}
                    />
                </>
            )}

            {editing === EditParent.FIRST && (
                <Box marginBlock="8">
                    <Box padding="4" borderWidth="1" borderRadius="small">
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
                    </Box>
                </Box>
            )}

            {editing === EditParent.SECOND && (
                <Box marginBlock="8">
                    <Box padding="4" borderWidth="1" borderRadius="small">
                        <DeceasedParent
                            type={ActionTypes.UPDATE_SECOND_PARENT}
                            prev={stopEditing}
                            next={stopEditing}
                            fnrRegisteredParent={fnrRegisteredParent()}
                        />
                    </Box>
                </Box>
            )}

            <Modal open={isOpen} onClose={() => setIsOpen(false)} aria-label={t('unknownParent')}>
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
