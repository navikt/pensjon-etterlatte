import { BodyShort, Box, Button, GuidePanel, Heading, HGrid, HStack, VStack } from '@navikt/ds-react'
import { useEffect, useState } from 'react'
import { FieldArrayWithId, FormProvider, useFieldArray, useForm } from 'react-hook-form'
import { v4 as uuid } from 'uuid'
import { useApplicationContext } from '~context/application/ApplicationContext'
import { ActionTypes } from '~context/application/application'
import { ApplicantRole } from '~types/applicant'
import { IAboutChildren, IChild } from '~types/person'
import ikon from '../../../assets/barn1.svg'
import useTranslation from '../../../hooks/useTranslation'
import Navigation from '../../common/Navigation'
import { RHFInput } from '../../common/rhf/RHFInput'
import { StepProps } from '../Dialogue'
import AddChildToForm from './add-child/AddChildToForm'
import ChildInfocard from './ChildInfocard'

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

    const cancel = (removeActive?: boolean) => {
        if (removeActive) remove(activeChildIndex)

        setActiveChildIndex(undefined)
    }

    const removeChild = (index: number) => {
        remove(index)
        const values = getValues()
        dispatch({ type: ActionTypes.UPDATE_ABOUT_CHILDREN, payload: { ...values } })
    }

    const updateChild = (child: IChild) => {
        if (activeChildIndex !== undefined) {
            update(activeChildIndex, child)
            clearErrors()
            const values = getValues()
            dispatch({ type: ActionTypes.UPDATE_ABOUT_CHILDREN, payload: { ...values } })
        }
        setActiveChildIndex(undefined)
    }

    const saveNext = (data: IAboutChildren) => {
        dispatch({ type: ActionTypes.UPDATE_ABOUT_CHILDREN, payload: { ...data, erValidert: true } })
        next!()
    }

    const savePrevious = (data: IAboutChildren) => {
        dispatch({ type: ActionTypes.UPDATE_ABOUT_CHILDREN, payload: { ...data, erValidert: true } })
        prev!()
    }

    const savePreviousWithoutValidation = () => {
        const values = getValues()
        dispatch({ type: ActionTypes.UPDATE_ABOUT_CHILDREN, payload: { ...values, erValidert: false } })
        prev!()
    }

    const { handleSubmit } = methods

    return (
        <>
            <FormProvider {...methods}>
                {activeChildIndex === undefined && (
                    <>
                        <VStack gap="8" marginBlock="12 0">
                            <VStack align="center">
                                <Heading size={'medium'}>
                                    {!isChild ? t('aboutChildrenTitle') : t('aboutSiblingsTitle')}
                                </Heading>
                            </VStack>

                            <GuidePanel>
                                <BodyShort>{isGuardian ? t('informationGuardian') : t('information')}</BodyShort>
                            </GuidePanel>

                            <Box>
                                <HGrid gap="4" columns={{ sm: 1, md: 2 }}>
                                    {fields?.map((field: FieldArrayWithId, index: number) => (
                                        <ChildInfocard
                                            key={uuid()}
                                            child={field as IChild}
                                            index={index}
                                            remove={removeChild}
                                            setActiveChildIndex={() => setActiveChildIndex(index)}
                                        />
                                    ))}

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
                                                <img alt="barn" src={ikon} />
                                            </HStack>
                                        </Box>
                                        <Box padding="8">
                                            <HStack marginBlock="0 4" justify="center">
                                                <Button variant={'primary'} type={'button'} onClick={addNewChild}>
                                                    {!isChild ? t('addChildButton') : t('addSiblingButton')}
                                                </Button>
                                            </HStack>
                                        </Box>
                                    </Box>
                                </HGrid>
                            </Box>

                            {/* Ensure at least one child is applying for childrens pension */}
                            <RHFInput
                                label={''}
                                hidden={true}
                                name={'children'}
                                valgfri={isChild}
                                rules={{
                                    validate: (children: IChild[]) =>
                                        isChild ||
                                        !!children.filter((child) => !!child.appliesForChildrensPension).length,
                                }}
                            />
                        </VStack>

                        <Navigation
                            left={{
                                onClick: isValidated ? handleSubmit(savePrevious) : savePreviousWithoutValidation,
                            }}
                            right={{ onClick: handleSubmit(saveNext) }}
                        />
                    </>
                )}

                {activeChildIndex !== undefined && (
                    <>
                        <Box marginInline="4">
                            <GuidePanel>
                                <BodyShort>{isGuardian ? t('informationGuardian') : t('information')}</BodyShort>
                            </GuidePanel>
                        </Box>
                        <AddChildToForm
                            save={updateChild}
                            cancel={cancel}
                            fnrRegisteredChild={fnrRegisteredChild(activeChildIndex)}
                            child={fields[activeChildIndex] as IChild}
                            isChild={isChild}
                            isGuardian={isGuardian}
                        />
                    </>
                )}
            </FormProvider>
        </>
    )
}
