import { useState } from 'react'
import ikon from '../../../assets/barn1.svg'
import ApplicationSteps from '../../../types/ApplicationSteps'
import { useApplicationContext } from '../../../context/application/ApplicationContext'
import { IChild, IAboutChild } from '../../../types/person'
import { ActionTypes } from '../../../context/application/application'
import useTranslation from '../../../hooks/useTranslation'
import ChildInfocard from './ChildInfocard'
import AddChildToForm from './AddChildToForm'
import { v4 as uuid } from 'uuid'
import Navigation from '../../common/Navigation'
import { Alert, BodyShort, Button, Modal, Panel, Heading } from '@navikt/ds-react'
import { FieldArrayWithId, FormProvider, useFieldArray, useForm } from 'react-hook-form'
import { RHFGeneralQuestionRadio } from '../../common/rhf/RHFRadio'
import { deepCopy } from '../../../utils/deepCopy'
import FormGroup from '../../common/FormGroup'
import OtherBenefits from './OtherBenefits'
import styled from 'styled-components'

const AboutChildrenWrapper = styled.div`
    .center {
        text-align: center;
    }

    .mute {
        color: #666;
    }

    .informasjonsboks-innhold {
        text-align: center;
    }
`

const InfocardWrapper = styled.div`
    display: flex;
    flex-flow: row wrap;
    //justify-content: space-evenly;
    margin: 0 auto;
    column-gap: 1rem;
`

const Infocard = styled.div`
    .typo-normal,
    .typo-element {
        margin: 0.3rem 0;
    }

    background-color: #e7e9e9;
    display: flex;
    flex-direction: column;
    margin-bottom: 1rem;
    flex-grow: 1;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;

    @media screen and (min-width: 650px) {
        max-width: 49%;
    }

    &.legg-til {
        height: 230px;
    }

    &__footer-item {
        display: flex;
        justify-content: center;
        flex-grow: 1;
        text-align: center;
    }

    &__footer {
        margin-bottom: 1rem;
    }

    .infokort-knapper {
        float: right;
    }

    &__endre-infokort {
        border: none;
        text-align: left;
        padding: inherit;
    }

    &__fullbredde {
        width: 100%;
        max-width: 100%;
    }
`

const InfocardHeader = styled.div`
    box-sizing: border-box;
    height: 128px;
    background-color: #4d3e55;
    border-top-right-radius: 5px;
    border-top-left-radius: 5px;
    border-bottom: 4px solid #826ba1;
    display: flex;
    align-items: flex-end;

    img {
        margin: 0 auto;
    }

    opacity: 0.4;
`

const InformationBox = styled.div`
    padding: 2rem 2rem;
    text-align: center;

    .informasjonselement {
        margin: 10px 0 10px 0;
    }
`

if (process.env.NODE_ENV !== 'test') Modal.setAppElement!!('#root') //Denne er også definert i Navigasjon. Trenger vi den?

const AboutChildren: ApplicationSteps = ({ next, previous }) => {
    const { t } = useTranslation('omBarn')
    const { state, dispatch } = useApplicationContext()

    const methods = useForm<IAboutChild>({
        defaultValues: state.aboutChildren || {},
    })

    const { watch, getValues } = methods

    const isValidated = state.aboutChildren?.erValidert
    const registeredChild = watch('child')

    const getFnrRegisteredChild = (): string[] => {
        if (registeredChild !== undefined) {
            return registeredChild.map((child) => (child.foedselsnummer !== undefined ? child.foedselsnummer : ''))
        } else {
            return []
        }
    }

    const fnrRegisteredChild = (activeChildIndex: number): string[] => {
        const fnr = getFnrRegisteredChild()
        fnr.splice(activeChildIndex, 1)
        return fnr
    }

    const { fields, append, update, remove } = useFieldArray({
        name: 'child',
        control: methods.control,
    })

    const [activeChildIndex, setActiveChildIndex] = useState<number | undefined>(undefined)

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
        previous!!()
    }

    const savePreviousWithoutValidation = () => {
        const values = getValues()
        dispatch({ type: ActionTypes.UPDATE_ABOUT_CHILDREN, payload: { ...deepCopy(values), erValidert: false } })
        previous!!()
    }

    const { handleSubmit } = methods

    return (
        <AboutChildrenWrapper>
            <FormProvider {...methods}>
                <form>
                    {activeChildIndex === undefined && (
                        <>
                            <FormGroup>
                                <Heading size={'medium'} className={'center'}>
                                    {t('tittel')}
                                </Heading>
                            </FormGroup>

                            <FormGroup>
                                <Panel border>
                                    <Alert variant={'info'} className={'navds-alert--inline'}>
                                        <BodyShort size={'small'}>{t('informasjon')}</BodyShort>
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
                                            <img alt="barn" className="barneikon" src={ikon} />
                                        </InfocardHeader>
                                        <InformationBox>
                                            <Button variant={'primary'} type={'button'} onClick={addNewChild}>
                                                {t('knapp.leggTilBarn')}
                                            </Button>
                                        </InformationBox>
                                    </Infocard>
                                </InfocardWrapper>
                            </FormGroup>
                            <FormGroup>
                                <RHFGeneralQuestionRadio
                                    name={'gravidEllerNyligFoedt'}
                                    legend={t('gravidEllerNyligFoedt')}
                                />
                            </FormGroup>

                            <OtherBenefits application={state} child={registeredChild} />

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
                        />
                    )}
                </form>
            </FormProvider>
        </AboutChildrenWrapper>
    )
}

export default AboutChildren
