import { Alert, BodyShort, Button, Modal, Panel } from '@navikt/ds-react'
import { useState } from 'react'
import { FieldArrayWithId, FormProvider, useFieldArray, useForm } from 'react-hook-form'
import styled from 'styled-components'
import { v4 as uuid } from 'uuid'
import ikon from '../../../assets/barn1.svg'
import { ActionTypes } from '../../../context/application/application'
import { useApplicationContext } from '../../../context/application/ApplicationContext'
import useTranslation from '../../../hooks/useTranslation'
import { IAboutChild, IChild } from '../../../types/person'
import { deepCopy } from '../../../utils/deepCopy'
import FormGroup from '../../common/FormGroup'
import Navigation from '../../common/Navigation'
import { RHFGeneralQuestionRadio } from '../../common/rhf/RHFRadio'
import StepHeading from '../../common/StepHeading'
import { StepProps } from '../Dialogue'
import { ApplicantRole } from '../scenario/ScenarioSelection'
import AddChildToForm from './AddChildToForm'
import ChildInfocard, { Infocard, InfocardHeader, InformationBox } from './ChildInfocard'

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

if (process.env.NODE_ENV !== 'test') Modal.setAppElement!!('#root') //Denne er også definert i Navigasjon. Trenger vi den?

export default function AboutChildren({ next, prev }: StepProps) {
    const [activeChildIndex, setActiveChildIndex] = useState<number | undefined>(undefined)

    const { t } = useTranslation('aboutChildren')
    const { state, dispatch } = useApplicationContext()

    const methods = useForm<IAboutChild>({
        defaultValues: state.aboutChildren || {},
    })

    const { watch, getValues } = methods

    const isValidated = state.aboutChildren?.erValidert
    const isChild = state.applicant?.applicantRole === ApplicantRole.CHILD
    const isGuardian = state.applicant?.applicantRole === ApplicantRole.GUARDIAN
    const registeredChild = watch('child')

    const getFnrRegisteredChild = (): string[] => registeredChild?.map((child) => child?.fnr || '') || []

    const fnrRegisteredChild = (activeChildIndex: number): string[] => {
        const fnr = getFnrRegisteredChild()
        fnr.splice(activeChildIndex, 1)
        return fnr
    }

    const { fields, append, update, remove } = useFieldArray({
        name: 'child',
        control: methods.control,
    })

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
        }
        setActiveChildIndex(undefined)
    }

    const saveNext = (data: IAboutChild) => {
        dispatch({ type: ActionTypes.UPDATE_ABOUT_CHILDREN, payload: { ...deepCopy(data), erValidert: true } })
        next!!()
    }

    const savePrevious = (data: IAboutChild) => {
        dispatch({ type: ActionTypes.UPDATE_ABOUT_CHILDREN, payload: { ...deepCopy(data), erValidert: true } })
        prev!!()
    }

    const savePreviousWithoutValidation = () => {
        const values = getValues()
        dispatch({ type: ActionTypes.UPDATE_ABOUT_CHILDREN, payload: { ...deepCopy(values), erValidert: false } })
        prev!!()
    }

    const { handleSubmit } = methods

    return (
        <AboutChildrenWrapper>
            <FormProvider {...methods}>
                <form>
                    {activeChildIndex === undefined && (
                        <>
                            <StepHeading>{!isChild ? t('title') : t('title.sibling')}</StepHeading>

                            <FormGroup>
                                <Panel border>
                                    <Alert variant={'info'} className={'navds-alert--inline'}>
                                        <BodyShort size={'small'}>
                                            {!isChild ? t('information') : t('information.sibling')}
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
                                            isChild={isChild}
                                        />
                                    ))}

                                    <Infocard>
                                        <InfocardHeader>
                                            <img alt="barn" className="barneikon" src={ikon} />
                                        </InfocardHeader>
                                        <InformationBox>
                                            <Button variant={'primary'} type={'button'} onClick={addNewChild}>
                                                {!isChild ? t('btn.addChild') : t('btn.addSibling')}
                                            </Button>
                                            {isChild && (
                                                <BodyShort size={'small'} className={'center mute'}>
                                                    {t('voluntary')}
                                                </BodyShort>
                                            )}
                                        </InformationBox>
                                    </Infocard>
                                </InfocardWrapper>
                            </FormGroup>
                            {!isChild && !isGuardian && (
                                <FormGroup>
                                    <RHFGeneralQuestionRadio
                                        name={'pregnantOrNewlyBorn'}
                                        legend={t('pregnantOrNewlyBorn')}
                                    />
                                </FormGroup>
                            )}

                            <Navigation
                                prev={isValidated === true ? handleSubmit(savePrevious) : savePreviousWithoutValidation}
                                next={handleSubmit(saveNext)}
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
                </form>
            </FormProvider>
        </AboutChildrenWrapper>
    )
}
