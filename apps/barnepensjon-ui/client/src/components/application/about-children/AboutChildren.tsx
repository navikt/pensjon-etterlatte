import { Alert, BodyShort, Button, Panel } from '@navikt/ds-react'
import { useEffect, useState } from 'react'
import { FieldArrayWithId, FormProvider, useFieldArray, useForm } from 'react-hook-form'
import styled from 'styled-components'
import { v4 as uuid } from 'uuid'
import ikon from '../../../assets/barn1.svg'
import { ActionTypes } from '../../../context/application/application'
import { useApplicationContext } from '../../../context/application/ApplicationContext'
import useTranslation from '../../../hooks/useTranslation'
import { IAboutChildren, IChild } from '../../../types/person'
import FormGroup from '../../common/FormGroup'
import Navigation from '../../common/Navigation'
import StepHeading from '../../common/StepHeading'
import { StepProps } from '../Dialogue'
import { ApplicantRole } from '../scenario/ScenarioSelection'
import { Infocard, InfocardHeader, InformationBox } from '../../common/card/InfoCard'
import ChildInfocard from './ChildInfocard'
import { RHFInput } from '../../common/rhf/RHFInput'
import AddChildToForm from './add-child/AddChildToForm'

const AboutChildrenWrapper = styled.div`
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

export default function AboutChildren({ next, prev }: StepProps) {
    const [activeChildIndex, setActiveChildIndex] = useState<number | undefined>(undefined)

    const { t } = useTranslation('aboutChildren')
    const { state, dispatch } = useApplicationContext()

    const methods = useForm<IAboutChildren>({
        defaultValues: state.aboutChildren || {},
        mode: 'onBlur',
    })
    const { watch, getValues, clearErrors, setValue } = methods
    const { fields, append, update, remove } = useFieldArray({
        name: 'children',
        control: methods.control,
    })
    useEffect(() => {
        if (state.aboutChildren?.children) {
            setValue('children', state.aboutChildren.children)
        }
    }, [state.aboutChildren?.children, setValue])

    const isValidated = !!state.aboutChildren?.erValidert
    const isChild = state.applicant?.applicantRole === ApplicantRole.CHILD
    const isGuardian = state.applicant?.applicantRole === ApplicantRole.GUARDIAN
    const registeredChildren = watch('children')

    const getFnrRegisteredChild = (): string[] => registeredChildren?.map((child) => child?.fnrDnr || '') || []

    const fnrRegisteredChild = (activeChildIndex: number): string[] => {
        const fnr = getFnrRegisteredChild()
        fnr.splice(activeChildIndex, 1)
        return fnr
    }

    const addNewChild = () => {
        append({})
        setActiveChildIndex(fields.length)
    }

    const removeNewChild = () => {
        remove(activeChildIndex)
    }

    const updateChild = (child: IChild) => {
        if (activeChildIndex !== undefined) {
            update(activeChildIndex, child)
            clearErrors()
        }
        setActiveChildIndex(undefined)
    }

    const saveNext = (data: IAboutChildren) => {
        dispatch({ type: ActionTypes.UPDATE_ABOUT_CHILDREN, payload: { ...data, erValidert: true } })
        next!!()
    }

    const savePrevious = (data: IAboutChildren) => {
        dispatch({ type: ActionTypes.UPDATE_ABOUT_CHILDREN, payload: { ...data, erValidert: true } })
        prev!!()
    }

    const savePreviousWithoutValidation = () => {
        const values = getValues()
        dispatch({ type: ActionTypes.UPDATE_ABOUT_CHILDREN, payload: { ...values, erValidert: false } })
        prev!!()
    }

    const { handleSubmit } = methods

    return (
        <AboutChildrenWrapper>
            <FormProvider {...methods}>
                {activeChildIndex === undefined && (
                    <>
                        <StepHeading>{!isChild ? t('aboutChildrenTitle') : t('aboutSiblingsTitle')}</StepHeading>

                        <FormGroup>
                            <Panel border>
                                <Alert variant={'info'} inline>
                                    <BodyShort size={'small'}>
                                        {!isChild ? t('information') : t('infoRegardingSiblings')}
                                    </BodyShort>
                                </Alert>
                            </Panel>
                        </FormGroup>

                        <FormGroup>
                            <InfocardWrapper>
                                {fields?.map((field: FieldArrayWithId, index: number) => (
                                    <ChildInfocard
                                        key={uuid()}
                                        child={field as IChild}
                                        index={index}
                                        remove={remove}
                                        setActiveChildIndex={() => setActiveChildIndex(index)}
                                    />
                                ))}

                                <Infocard>
                                    <InfocardHeader>
                                        <img alt="barn" src={ikon} />
                                    </InfocardHeader>
                                    <InformationBox>
                                        <Button variant={'primary'} type={'button'} onClick={addNewChild}>
                                            {!isChild ? t('addChildButton') : t('addSiblingButton')}
                                        </Button>
                                        {isChild && (
                                            <BodyShort size={'small'} className={'center mute'}>
                                                {t('thisIsOptional')}
                                            </BodyShort>
                                        )}
                                    </InformationBox>
                                </Infocard>
                            </InfocardWrapper>
                        </FormGroup>

                        {/* Ensure at least one child is applying for childrens pension */}
                        <FormGroup>
                            <RHFInput
                                hidden={true}
                                name={'children'}
                                valgfri={isChild}
                                rules={{
                                    validate: (children: IChild[]) =>
                                        isChild ||
                                        !!children.filter((child) => !!child.appliesForChildrensPension).length,
                                }}
                            />
                        </FormGroup>

                        <Navigation
                            left={{
                                onClick: isValidated ? handleSubmit(savePrevious) : savePreviousWithoutValidation,
                            }}
                            right={{ onClick: handleSubmit(saveNext) }}
                        />
                    </>
                )}

                {activeChildIndex !== undefined && (
                    <AddChildToForm
                        save={updateChild}
                        cancel={() => setActiveChildIndex(undefined)}
                        fnrRegisteredChild={fnrRegisteredChild(activeChildIndex)}
                        child={fields[activeChildIndex] as IChild}
                        removeCanceledNewChild={removeNewChild}
                        isChild={isChild}
                        isGuardian={isGuardian}
                    />
                )}
            </FormProvider>
        </AboutChildrenWrapper>
    )
}
